import React, { useState, useEffect } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { Sparkles, Crown, X, VolumeX, Play } from 'lucide-react';

export default function AdBannerOverlay({ isPlaying, onAdComplete }) {
    const { subscription, activePlanDetails, setIsPricingModalOpen } = useSubscription();

    const [showAd, setShowAd] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [canSkip, setCanSkip] = useState(false);

    useEffect(() => {
        // If user has 100% ad-free plan (Silver / Gold), never show ads
        if (activePlanDetails.limits.adFree) {
            setShowAd(false);
            return;
        }

        // Trigger ad break periodically if playing
        const timer = setTimeout(() => {
            if (isPlaying) {
                setShowAd(true);
                setCountdown(5);
                setCanSkip(false);
            }
        }, 45000); // 45 sec periodic demo ad break

        return () => clearTimeout(timer);
    }, [isPlaying, activePlanDetails]);

    useEffect(() => {
        if (!showAd) return;
        if (countdown > 0) {
            const interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanSkip(true);
        }
    }, [showAd, countdown]);

    if (!showAd) return null;

    const handleSkip = () => {
        setShowAd(false);
        if (onAdComplete) onAdComplete();
    };

    return (
        <div className="ad-overlay-container">
            <div className="ad-banner-box">
                <div className="ad-header">
                    <span className="ad-badge">SPONSORED AD BREAK</span>
                    <span className="ad-plan-tag">Free Tier Experience</span>
                </div>

                <div className="ad-body">
                    <div className="ad-promo">
                        <Sparkles size={24} className="text-amber-400 animate-bounce" />
                        <div>
                            <h4>Tired of Interruptions?</h4>
                            <p>Upgrade to Silver or Gold for 100% Ad-Free 4K Cinema Streaming!</p>
                        </div>
                    </div>

                    <div className="ad-actions">
                        <button
                            className="btn btn-cyan btn-sm"
                            onClick={() => {
                                setShowAd(false);
                                setIsPricingModalOpen(true);
                            }}
                        >
                            <Crown size={14} /> Go Ad-Free
                        </button>

                        {canSkip ? (
                            <button className="btn btn-primary btn-sm" onClick={handleSkip}>
                                Skip Ad ⏭
                            </button>
                        ) : (
                            <span className="countdown-pill">Skip in {countdown}s</span>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .ad-overlay-container {
          position: absolute;
          bottom: 70px;
          left: 20px;
          right: 20px;
          z-index: 40;
          animation: slideUp 0.3s ease-out;
        }
        .ad-banner-box {
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid var(--amber);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.7);
        }
        .ad-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ad-badge {
          background: var(--amber);
          color: black;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }
        .ad-plan-tag {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .ad-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .ad-promo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ad-promo h4 {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .ad-promo p {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .ad-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .countdown-pill {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid var(--border-glass);
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
