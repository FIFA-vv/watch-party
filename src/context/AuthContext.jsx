import React, { createContext, useContext, useState, useEffect } from 'react';
import { determineLoginTheme, getISTComponents, isLightModeISTWindow } from '../utils/timeUtils';
import { evaluateSecurityRisk, generateOtp } from '../utils/securityUtils';

const DEFAULT_USER = {
    id: 'usr_alex_88',
    name: 'Alex Rivera',
    email: 'alex.rivera@aurastream.io',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Senior System Architect',
    themePreference: 'dark',
    autoThemeByLoginTime: true,
    trustedCities: ['Mumbai', 'Delhi'],
    trustedStates: ['Maharashtra', 'Delhi'],
    trustedDevices: ['Chrome on Windows 11 (Desktop)'],
    lastLoginTime: null,
    lastLoginRegion: null,
};

const DEFAULT_LOGIN_CONTEXT = {
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    device: 'Chrome on Windows 11 (Desktop)',
    deviceType: 'Desktop',
    simulatedTimeIST: null,
};

const AuthContext = createContext(undefined);

const USER_STORAGE_KEY = 'aurastream_user_profile_v2';
const LOGS_STORAGE_KEY = 'aurastream_audit_logs_v2';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem(USER_STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse user profile', e);
            }
        }
        return DEFAULT_USER;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [currentTheme, setCurrentTheme] = useState(user.themePreference || 'dark');
    const [loginContext, setLoginContext] = useState(DEFAULT_LOGIN_CONTEXT);

    // OTP & Risk state
    const [otpPending, setOtpPending] = useState(false);
    const [activeOtp, setActiveOtp] = useState(null);
    const [otpDeliveryMethod, setOtpDeliveryMethod] = useState('email');
    const [securityRisk, setSecurityRisk] = useState(null);
    const [pendingLoginContext, setPendingLoginContext] = useState(null);

    // Modals & Panels
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Audit Logs
    const [auditLogs, setAuditLogs] = useState(() => {
        const saved = localStorage.getItem(LOGS_STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse audit logs', e);
            }
        }
        const ist = getISTComponents();
        return [
            {
                id: 'log_init_001',
                timestamp: new Date().toISOString(),
                formattedTimeIST: `${ist.formattedDate}, 10:15:00 AM IST`,
                city: 'Mumbai',
                state: 'Maharashtra',
                country: 'India',
                device: 'Chrome on Windows 11 (Desktop)',
                appliedTheme: 'light',
                verificationMethod: 'DIRECT_TRUSTED',
                securityFlags: [],
                status: 'SUCCESS',
            },
        ];
    });

    // Toasts
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(auditLogs));
    }, [auditLogs]);

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        if (currentTheme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
            body.classList.add('dark');
            body.classList.remove('light');
        } else {
            root.classList.add('light');
            root.classList.remove('dark');
            body.classList.add('light');
            body.classList.remove('dark');
        }
    }, [currentTheme]);


    const addToast = (toast) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
        setNotifications((prev) => [...prev, { ...toast, id }]);

        setTimeout(() => {
            removeToast(id);
        }, toast.duration || 5000);
    };

    const removeToast = (id) => {
        setNotifications((prev) => prev.filter((t) => t.id !== id));
    };

    const finalizeLoginSuccess = (
        ctx,
        verificationMethod,
        newDeviceAdded = false,
        newLocationAdded = false
    ) => {
        let calculatedTheme = user.themePreference;

        if (user.autoThemeByLoginTime) {
            calculatedTheme = determineLoginTheme(ctx.simulatedTimeIST);
        }

        const { displayTimeIST, reason } = isLightModeISTWindow(ctx.simulatedTimeIST);

        setUser((prev) => {
            const updatedCities = Array.from(new Set([...prev.trustedCities, ctx.city]));
            const updatedStates = Array.from(new Set([...prev.trustedStates, ctx.state]));
            const updatedDevices = Array.from(new Set([...prev.trustedDevices, ctx.device]));

            const newEmail = ctx.email || prev.email;
            let newName = prev.name;
            if (ctx.email && ctx.email.toLowerCase() !== prev.email.toLowerCase()) {
                const namePart = ctx.email.split('@')[0];
                newName = namePart.split(/[\._\-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            }

            return {
                ...prev,
                email: newEmail,
                name: newName,
                themePreference: calculatedTheme,
                trustedCities: updatedCities,
                trustedStates: updatedStates,
                trustedDevices: updatedDevices,
                lastLoginTime: displayTimeIST,
                lastLoginRegion: {
                    city: ctx.city,
                    state: ctx.state,
                    country: ctx.country,
                },
            };
        });

        setCurrentTheme(calculatedTheme);

        const ist = getISTComponents();
        const newLog = {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            formattedTimeIST: displayTimeIST || `${ist.formattedDate}, ${ist.formattedTime} IST`,
            city: ctx.city,
            state: ctx.state,
            country: ctx.country,
            device: ctx.device,
            appliedTheme: calculatedTheme,
            verificationMethod,
            securityFlags: [
                ...(newDeviceAdded ? ['NEW_DEVICE_VERIFIED'] : []),
                ...(newLocationAdded ? ['NEW_LOCATION_VERIFIED'] : []),
            ],
            status: 'SUCCESS',
        };

        setAuditLogs((prev) => [newLog, ...prev]);

        setIsAuthenticated(true);
        setOtpPending(false);
        setActiveOtp(null);
        setSecurityRisk(null);
        setPendingLoginContext(null);
        setIsAuthModalOpen(false);

        addToast({
            type: 'success',
            title: 'Login Successful',
            message: `Welcome back, ${user.name}!`,
        });

        addToast({
            type: 'info',
            title: `Applied Theme: ${calculatedTheme.toUpperCase()}`,
            message: reason,
            duration: 7000,
        });

        if (newDeviceAdded || newLocationAdded) {
            addToast({
                type: 'security',
                title: 'Security Notice',
                message: `Newly verified ${newDeviceAdded ? 'Device' : ''} ${newLocationAdded ? '& Location' : ''} added to your trusted profile.`,
                duration: 6000,
            });
        }
    };

    const initiateLogin = (customContext) => {
        const ctx = customContext || loginContext;
        const risk = evaluateSecurityRisk(user, ctx);

        setSecurityRisk(risk);
        setPendingLoginContext(ctx);

        if (risk.requiresOtp) {
            const newCode = generateOtp();
            setActiveOtp(newCode);
            setOtpPending(true);

            const riskLabels = [];
            if (risk.isNewCity) riskLabels.push(`New City (${ctx.city})`);
            if (risk.isNewState) riskLabels.push(`New State (${ctx.state})`);
            if (risk.isNewDevice) riskLabels.push(`Unrecognized Device (${ctx.device})`);

            addToast({
                type: 'security',
                title: 'Security Check Triggered',
                message: `Login detected from ${riskLabels.join(', ')}. Please verify with OTP.`,
                duration: 8000,
            });
        } else {
            finalizeLoginSuccess(ctx, 'DIRECT_TRUSTED');
        }
    };

    const verifyOtp = (enteredCode) => {
        if (enteredCode === activeOtp) {
            if (pendingLoginContext && securityRisk) {
                const isNewLocation = securityRisk.isNewCity || securityRisk.isNewState;
                finalizeLoginSuccess(
                    pendingLoginContext,
                    otpDeliveryMethod === 'email' ? 'OTP_EMAIL' : 'OTP_SMS',
                    securityRisk.isNewDevice,
                    isNewLocation
                );
            }
            return true;
        } else {
            addToast({
                type: 'warning',
                title: 'Verification Failed',
                message: 'Invalid OTP code. Please check and try again.',
            });
            return false;
        }
    };

    const resendOtp = (method) => {
        const delivery = method || otpDeliveryMethod;
        if (method) setOtpDeliveryMethod(method);

        const newCode = generateOtp();
        setActiveOtp(newCode);

        const contactStr = delivery === 'email' ? user.email : user.phone;
        addToast({
            type: 'info',
            title: 'New OTP Sent',
            message: `A fresh 6-digit code was sent to your ${delivery} (${contactStr}).`,
        });
    };

    const cancelOtpLogin = () => {
        setOtpPending(false);
        setActiveOtp(null);
        setSecurityRisk(null);
        setPendingLoginContext(null);
    };

    const setTheme = (theme, updateProfile = true) => {
        setCurrentTheme(theme);
        if (updateProfile) {
            setUser((prev) => ({ ...prev, themePreference: theme }));
            addToast({
                type: 'info',
                title: 'Theme Preference Saved',
                message: `Your profile theme has been set to ${theme.toUpperCase()}.`,
            });
        }
    };

    const toggleAutoThemeByLoginTime = (enabled) => {
        setUser((prev) => ({ ...prev, autoThemeByLoginTime: enabled }));
        addToast({
            type: 'info',
            title: 'Adaptive Theme Preference Updated',
            message: enabled
                ? 'Theme will auto-adjust based on your login time IST (10 AM - 12 PM Light Mode).'
                : 'Auto-theme disabled. Profile manual theme active.',
        });
    };

    const logout = () => {
        setIsAuthenticated(false);
        addToast({
            type: 'info',
            title: 'Logged Out',
            message: 'You have been safely logged out.',
        });
    };

    const revokeTrustedDevice = (deviceName) => {
        setUser((prev) => ({
            ...prev,
            trustedDevices: prev.trustedDevices.filter((d) => d !== deviceName),
        }));
        addToast({
            type: 'warning',
            title: 'Device Removed',
            message: `"${deviceName}" is no longer trusted. Next login from this device will require OTP.`,
        });
    };

    const revokeTrustedLocation = (city, state) => {
        setUser((prev) => ({
            ...prev,
            trustedCities: prev.trustedCities.filter((c) => c.toLowerCase() !== city.toLowerCase()),
            trustedStates: prev.trustedStates.filter((s) => s.toLowerCase() !== state.toLowerCase()),
        }));
        addToast({
            type: 'warning',
            title: 'Location Removed',
            message: `"${city}, ${state}" removed from trusted locations.`,
        });
    };

    const resetToDefaultProfile = () => {
        setUser(DEFAULT_USER);
        setCurrentTheme('dark');
        localStorage.removeItem(USER_STORAGE_KEY);
        addToast({
            type: 'info',
            title: 'Profile Reset',
            message: 'User profile restored to original default demo state.',
        });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                currentTheme,
                loginContext,
                otpPending,
                activeOtp,
                otpDeliveryMethod,
                securityRisk,
                auditLogs,
                notifications,
                isAuthModalOpen,
                setIsAuthModalOpen,
                isProfileModalOpen,
                setIsProfileModalOpen,
                initiateLogin,
                verifyOtp,
                resendOtp,
                setOtpDeliveryMethod,
                logout,
                setTheme,
                toggleAutoThemeByLoginTime,
                setLoginContext,
                revokeTrustedDevice,
                revokeTrustedLocation,
                resetToDefaultProfile,
                addToast,
                removeToast,
                cancelOtpLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
