import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUBSCRIPTION_PLANS } from '../data/plansData';
import { generateInvoice, exportInvoicePDF } from '../utils/invoiceGenerator';
import confetti from 'canvas-confetti';

const DEFAULT_SUBSCRIPTION = {
    plan: 'Free',
    billingCycle: 'monthly',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: 'Lifetime',
    autoRenew: true,
    dailyWatchTimeUsed: 0,
    dailyDownloadsUsed: 0,
    lastWatchTimeReset: new Date().toISOString().split('T')[0],
    lastDownloadReset: new Date().toISOString().split('T')[0],
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@aurastream.io',
    invoiceHistory: [],
};

const SubscriptionContext = createContext(undefined);

export const SubscriptionProvider = ({ children }) => {
    const [subscription, setSubscription] = useState(() => {
        try {
            const stored = localStorage.getItem('wetube_user_subscription');
            if (stored) {
                const parsed = JSON.parse(stored);
                const today = new Date().toISOString().split('T')[0];

                if (parsed.lastWatchTimeReset !== today) {
                    parsed.dailyWatchTimeUsed = 0;
                    parsed.lastWatchTimeReset = today;
                }
                if (parsed.lastDownloadReset !== today) {
                    parsed.dailyDownloadsUsed = 0;
                    parsed.lastDownloadReset = today;
                }
                return parsed;
            }
        } catch (e) {
            console.error('Failed to load subscription state', e);
        }
        return DEFAULT_SUBSCRIPTION;
    });

    const [billingCycle, setBillingCycle] = useState('monthly');
    const [activeInvoice, setActiveInvoice] = useState(null);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [pendingUpgradePlan, setPendingUpgradePlan] = useState(null);

    const saveSubscription = (newState) => {
        setSubscription(newState);
        try {
            localStorage.setItem('wetube_user_subscription', JSON.stringify(newState));
        } catch (e) {
            console.error('Failed to save subscription', e);
        }
    };

    const activePlanDetails = SUBSCRIPTION_PLANS[subscription.plan] || SUBSCRIPTION_PLANS.Free;

    const openCheckout = (planId) => {
        if (planId === subscription.plan) {
            alert(`You are currently on the ${planId} plan!`);
            return;
        }
        setPendingUpgradePlan(planId);
        setIsPricingModalOpen(false);
    };


    const upgradePlan = (
        planId,
        paymentId,
        orderId,
        paymentMethod = 'Razorpay Test Payment'
    ) => {
        const newInvoice = generateInvoice(
            planId,
            billingCycle,
            subscription.userEmail,
            subscription.userName,
            paymentId,
            orderId,
            paymentMethod
        );

        const updatedState = {
            ...subscription,
            plan: planId,
            billingCycle,
            status: 'active',
            startDate: newInvoice.createdAt,
            expiryDate: newInvoice.expiryDate,
            lastPaymentId: newInvoice.paymentId,
            lastOrderId: newInvoice.orderId,
            dailyWatchTimeUsed: 0,
            dailyDownloadsUsed: 0,
            invoiceHistory: [newInvoice, ...(subscription.invoiceHistory || [])],
        };

        saveSubscription(updatedState);
        setActiveInvoice(newInvoice);
        setPendingUpgradePlan(null);

        try {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#EAB308', '#38BDF8', '#D97706', '#EF4444', '#10B981'],
            });
        } catch (err) {
            console.log('Confetti effect fired');
        }

        setIsInvoiceModalOpen(true);
    };

    const cancelSubscription = () => {
        const updatedState = {
            ...subscription,
            status: 'cancelled',
            autoRenew: false,
        };
        saveSubscription(updatedState);
    };

    const canWatchVideo = (videoTier = 'Free') => {
        const tierHierarchy = { Free: 0, Bronze: 1, Silver: 2, Gold: 3 };
        const userRank = tierHierarchy[subscription.plan] || 0;
        const videoRank = tierHierarchy[videoTier] || 0;

        if (userRank < videoRank) {
            return {
                allowed: false,
                reason: `This video is exclusive to ${videoTier} tier and above. Please upgrade to unlock.`,
                requiredPlan: videoTier,
            };
        }

        const dailyLimit = activePlanDetails.limits.dailyWatchLimitMinutes;
        if (dailyLimit !== null && subscription.dailyWatchTimeUsed >= dailyLimit) {
            return {
                allowed: false,
                reason: `You have reached your daily watch limit of ${dailyLimit} minutes on the ${subscription.plan} plan. Upgrade to Silver or Gold for unlimited watch time!`,
                requiredPlan: 'Silver',
            };
        }

        return { allowed: true };
    };

    const canDownloadVideo = (resolution = '720p') => {
        const resRank = { '360p': 0, '480p': 1, '720p': 2, '1080p': 3, '1440p': 4, '4K': 5 };
        const maxAllowedRes = activePlanDetails.limits.maxDownloadResolution;

        const requestedRank = resRank[resolution] !== undefined ? resRank[resolution] : 2;
        const allowedRank = resRank[maxAllowedRes] !== undefined ? resRank[maxAllowedRes] : 1;

        if (requestedRank > allowedRank) {
            return {
                allowed: false,
                reason: `${resolution} downloads are not supported on ${subscription.plan} plan. (Max: ${maxAllowedRes}). Upgrade to Gold for 4K downloads!`,
                requiredPlan: 'Gold',
            };
        }

        const dailyLimit = activePlanDetails.limits.dailyDownloadLimit;
        if (dailyLimit !== null && subscription.dailyDownloadsUsed >= dailyLimit) {
            const nextPlan = subscription.plan === 'Free' ? 'Bronze' : subscription.plan === 'Bronze' ? 'Silver' : 'Gold';
            return {
                allowed: false,
                reason: `Daily download limit reached (${subscription.dailyDownloadsUsed}/${dailyLimit} downloads used). Upgrade your plan for higher limits!`,
                requiredPlan: nextPlan,
            };
        }

        return { allowed: true };
    };

    const recordWatchTime = (minutes) => {
        const updated = {
            ...subscription,
            dailyWatchTimeUsed: subscription.dailyWatchTimeUsed + minutes,
        };
        saveSubscription(updated);
        return true;
    };

    const recordDownload = () => {
        const updated = {
            ...subscription,
            dailyDownloadsUsed: subscription.dailyDownloadsUsed + 1,
        };
        saveSubscription(updated);
        return true;
    };

    const downloadInvoicePDF = (invoice) => {
        exportInvoicePDF(invoice);
    };

    return (
        <SubscriptionContext.Provider
            value={{
                subscription,
                plans: SUBSCRIPTION_PLANS,
                activePlanDetails,
                billingCycle,
                setBillingCycle,
                upgradePlan,
                cancelSubscription,
                canWatchVideo,
                canDownloadVideo,
                recordWatchTime,
                recordDownload,
                activeInvoice,
                setActiveInvoice,
                isPricingModalOpen,
                setIsPricingModalOpen,
                isInvoiceModalOpen,
                setIsInvoiceModalOpen,
                pendingUpgradePlan,
                setPendingUpgradePlan,
                openCheckout,
                downloadInvoicePDF,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
