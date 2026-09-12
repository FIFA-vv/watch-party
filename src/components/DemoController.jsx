import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sliders, ShieldAlert, Sun, Moon, MapPin, Clock, Key } from 'lucide-react';

export default function DemoController() {
    const {
        loginContext,
        setLoginContext,
        initiateLogin,
        setIsAuthModalOpen,
        setIsProfileModalOpen,
    } = useAuth();

    const [isOpen, setIsOpen] = useState(false);

    const triggerQuickScenario = (city, state, device, timeIST) => {
        const customCtx = {
            city,
            state,
            country: 'India',
            device,
            deviceType: 'Desktop',
            simulatedTimeIST: timeIST,
        };
        setLoginContext(customCtx);
        initiateLogin(customCtx);
    };

    return (
        <div className="demo-controller-wrap">
            <button
                className="demo-toggle-fab"
                onClick={() => setIsOpen(!isOpen)}
                title="Security & Theme Controller"
            >
                <Sliders size={20} className="animate-spin-slow" />
                <span className="fab-label">Security & Theme Simulator</span>
            </button>

            {isOpen && (
                <div className="demo-drawer-card glass-panel">
                    <div className="drawer-header">
                        <h4><ShieldAlert size={16} className="text-cyan" /> Risk & Theme Controller</h4>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <p className="drawer-intro">
                        Quickly test risk scenarios to verify OTP triggers and IST adaptive theme switching.
                    </p>

                    <div className="scenario-buttons">
                        <button
                            className="scenario-btn scenario-light"
                            onClick={() => triggerQuickScenario('Mumbai', 'Maharashtra', 'Chrome on Windows 11 (Desktop)', '10:30 AM')}
                        >
                            <Sun size={15} />
                            <div>
                                <strong>Light Theme Window (10 AM - 12 PM IST)</strong>
                                <span>Mumbai [Trusted] • 10:30 AM IST</span>
                            </div>
                        </button>

                        <button
                            className="scenario-btn scenario-dark"
                            onClick={() => triggerQuickScenario('Mumbai', 'Maharashtra', 'Chrome on Windows 11 (Desktop)', '08:45 PM')}
                        >
                            <Moon size={15} />
                            <div>
                                <strong>Dark Theme Window (Night IST)</strong>
                                <span>Mumbai [Trusted] • 08:45 PM IST</span>
                            </div>
                        </button>

                        <button
                            className="scenario-btn scenario-otp"
                            onClick={() => triggerQuickScenario('Bengaluru', 'Karnataka', 'Safari on iPhone 15 Pro (Mobile)', '11:00 AM')}
                        >
                            <Key size={15} />
                            <div>
                                <strong>Trigger Risk OTP Check</strong>
                                <span>New City (Bengaluru) & New Mobile Device</span>
                            </div>
                        </button>
                    </div>

                    <div className="drawer-footer">
                        <button className="btn btn-secondary btn-sm" onClick={() => setIsAuthModalOpen(true)}>
                            Full Login Test Form
                        </button>
                        <button className="btn btn-cyan btn-sm" onClick={() => setIsProfileModalOpen(true)}>
                            View Security Logs
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        .demo-controller-wrap {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 900;
        }
        .demo-toggle-fab {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%);
          color: white;
          border: 1px solid var(--border-glass);
          padding: 10px 18px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          transition: all 0.2s ease;
        }
        .demo-toggle-fab:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(6, 182, 212, 0.6);
        }
        .demo-drawer-card {
          position: absolute;
          bottom: 54px;
          left: 0;
          width: 380px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .drawer-header h4 {
          font-size: 0.95rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .drawer-intro {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.35;
        }
        .scenario-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .scenario-btn {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          color: var(--text-main);
          text-align: left;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .scenario-btn:hover {
          border-color: var(--cyan);
          background: rgba(30, 41, 59, 0.9);
          transform: translateX(4px);
        }
        .scenario-btn strong {
          display: block;
          color: var(--text-main);
        }
        .scenario-btn span {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .scenario-light { border-left: 4px solid #f59e0b; }
        .scenario-dark { border-left: 4px solid #8b5cf6; }
        .scenario-otp { border-left: 4px solid #f43f5e; }
        .drawer-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 6px;
          padding-top: 10px;
          border-top: 1px solid var(--border-glass);
        }
      `}</style>
        </div>
    );
}
