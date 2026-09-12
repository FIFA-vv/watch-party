import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, MapPin, Smartphone, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { evaluateSecurityRisk } from '../utils/securityUtils';
import { isLightModeISTWindow } from '../utils/timeUtils';

export default function AuthModal() {
    const {
        isAuthModalOpen,
        setIsAuthModalOpen,
        user,
        loginContext,
        setLoginContext,
        initiateLogin,
    } = useAuth();

    const [simulatedCity, setSimulatedCity] = useState(loginContext.city);
    const [simulatedState, setSimulatedState] = useState(loginContext.state);
    const [simulatedDevice, setSimulatedDevice] = useState(loginContext.device);
    const [simulatedTime, setSimulatedTime] = useState(loginContext.simulatedTimeIST || '10:30 AM');

    if (!isAuthModalOpen) return null;

    const currentEvaluation = evaluateSecurityRisk(user, {
        city: simulatedCity,
        state: simulatedState,
        country: 'India',
        device: simulatedDevice,
        deviceType: 'Desktop',
        simulatedTimeIST: simulatedTime,
    });

    const { isLightMode, reason: themeReason } = isLightModeISTWindow(simulatedTime);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedCtx = {
            city: simulatedCity,
            state: simulatedState,
            country: 'India',
            device: simulatedDevice,
            deviceType: 'Desktop',
            simulatedTimeIST: simulatedTime,
        };
        setLoginContext(updatedCtx);
        initiateLogin(updatedCtx);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content auth-modal-box">
                <div className="modal-header">
                    <div className="brand-logo-modal">
                        <Shield size={24} className="text-cyan animate-pulse" />
                        <h2>Secure Risk-Based Login</h2>
                    </div>
                    <button className="close-btn" onClick={() => setIsAuthModalOpen(false)}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-section">
                        <span className="section-label">Simulate Login Environment & Location</span>

                        <div className="input-group">
                            <label><MapPin size={14} /> City</label>
                            <input
                                type="text"
                                className="input-field"
                                value={simulatedCity}
                                onChange={(e) => setSimulatedCity(e.target.value)}
                                placeholder="e.g. Mumbai, Tokyo, London"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label><MapPin size={14} /> State / Region</label>
                            <input
                                type="text"
                                className="input-field"
                                value={simulatedState}
                                onChange={(e) => setSimulatedState(e.target.value)}
                                placeholder="e.g. Maharashtra, Kanto"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label><Smartphone size={14} /> Device Fingerprint</label>
                            <select
                                className="input-field"
                                value={simulatedDevice}
                                onChange={(e) => setSimulatedDevice(e.target.value)}
                            >
                                <option value="Chrome on Windows 11 (Desktop)">Chrome on Windows 11 (Desktop) [Trusted]</option>
                                <option value="Safari on iPhone 15 Pro (Mobile)">Safari on iPhone 15 Pro (Mobile) [New Device]</option>
                                <option value="Firefox on macOS Sonoma (Laptop)">Firefox on macOS Sonoma (Laptop) [New Device]</option>
                                <option value="Unknown Linux Workstation">Unknown Linux Workstation [High Risk]</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label><Clock size={14} /> Login Time (IST)</label>
                            <input
                                type="text"
                                className="input-field"
                                value={simulatedTime}
                                onChange={(e) => setSimulatedTime(e.target.value)}
                                placeholder="e.g. 10:30 AM, 11:45 AM, 08:30 PM"
                            />
                            <span className="field-hint">
                                Window: <strong>10:00 AM – 12:00 PM IST</strong> auto-triggers Light Theme!
                            </span>
                        </div>
                    </div>

                    {/* Realtime Risk Indicator */}
                    <div className={`risk-preview-box risk-${currentEvaluation.riskLevel.toLowerCase()}`}>
                        <div className="risk-header">
                            <AlertTriangle size={16} />
                            <span>Realtime Security Check: <strong>{currentEvaluation.riskLevel} RISK</strong></span>
                        </div>

                        <p className="risk-reason">{currentEvaluation.summaryReason}</p>
                        <p className="theme-reason">🎨 {themeReason}</p>
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn">
                        <span>Proceed to Login</span>
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>

            <style>{`
        .auth-modal-box {
          max-width: 520px;
        }
        .brand-logo-modal {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-logo-modal h2 {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-glass);
        }
        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-label {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 700;
          margin-bottom: 12px;
          display: block;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }
        .input-group label {
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
        }
        .field-hint {
          font-size: 0.75rem;
          color: var(--cyan);
        }
        .risk-preview-box {
          padding: 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
          background: rgba(30, 41, 59, 0.6);
          font-size: 0.82rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .risk-low { border-color: rgba(16, 185, 129, 0.4); background: rgba(16, 185, 129, 0.1); }
        .risk-medium { border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.1); }
        .risk-high { border-color: rgba(244, 63, 94, 0.4); background: rgba(244, 63, 94, 0.1); }

        .risk-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }
        .risk-reason {
          color: var(--text-main);
        }
        .theme-reason {
          color: var(--text-muted);
          font-size: 0.78rem;
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
        }
      `}</style>
        </div>
    );
}
