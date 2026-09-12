import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, KeyRound, Mail, Smartphone, RefreshCw, AlertCircle } from 'lucide-react';

export default function OtpVerificationModal() {
    const {
        otpPending,
        activeOtp,
        otpDeliveryMethod,
        setOtpDeliveryMethod,
        verifyOtp,
        resendOtp,
        cancelOtpLogin,
        securityRisk,
        user,
    } = useAuth();

    const [otpInput, setOtpInput] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (!otpPending) return;
        setTimer(60);
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [otpPending, activeOtp]);

    if (!otpPending) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        const success = verifyOtp(otpInput);
        if (!success) {
            setErrorMsg('Incorrect 6-digit code. Please try again or resend code.');
        }
    };

    const handleResend = () => {
        resendOtp(otpDeliveryMethod);
        setTimer(60);
        setErrorMsg('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content otp-modal-box">
                <div className="otp-icon-header">
                    <div className="otp-shield-badge">
                        <ShieldAlert size={28} className="text-rose-400 animate-bounce" />
                    </div>
                    <h3>Security Verification Required</h3>
                    <p className="otp-subtitle">
                        Unrecognized device or location detected. Enter the 6-digit OTP code sent to verify your identity.
                    </p>
                </div>

                {securityRisk && (
                    <div className="risk-summary-callout">
                        <AlertCircle size={15} className="text-rose-400" />
                        <div>
                            <strong>Trigger Factors:</strong> {securityRisk.riskFactors.join(' • ')}
                        </div>
                    </div>
                )}

                {/* Demo OTP Helper Banner */}
                <div className="demo-otp-banner">
                    <span>🔑 Demo Simulation Code: <strong>{activeOtp}</strong></span>
                </div>

                <form onSubmit={handleSubmit} className="otp-form">
                    <div className="delivery-selector">
                        <button
                            type="button"
                            className={`delivery-btn ${otpDeliveryMethod === 'email' ? 'active' : ''}`}
                            onClick={() => setOtpDeliveryMethod('email')}
                        >
                            <Mail size={16} />
                            <span>Email ({user.email.substring(0, 4)}***)</span>
                        </button>
                        <button
                            type="button"
                            className={`delivery-btn ${otpDeliveryMethod === 'sms' ? 'active' : ''}`}
                            onClick={() => setOtpDeliveryMethod('sms')}
                        >
                            <Smartphone size={16} />
                            <span>SMS ({user.phone.substring(0, 6)}***)</span>
                        </button>
                    </div>

                    <div className="otp-input-wrap">
                        <KeyRound size={20} className="text-muted" />
                        <input
                            type="text"
                            maxLength={6}
                            className="otp-code-input"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="000000"
                            autoFocus
                            required
                        />
                    </div>

                    {errorMsg && <div className="error-banner">{errorMsg}</div>}

                    <div className="otp-actions">
                        <button type="submit" className="btn btn-danger verify-btn">
                            Verify OTP Code
                        </button>

                        <div className="resend-row">
                            {timer > 0 ? (
                                <span className="timer-text">Resend code in {timer}s</span>
                            ) : (
                                <button type="button" className="btn-link" onClick={handleResend}>
                                    <RefreshCw size={14} /> Resend OTP Code
                                </button>
                            )}

                            <button type="button" className="btn-link text-dim" onClick={cancelOtpLogin}>
                                Cancel Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
        .otp-modal-box {
          max-width: 440px;
          text-align: center;
        }
        .otp-icon-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .otp-shield-badge {
          width: 56px;
          height: 56px;
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid rgba(244, 63, 94, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }
        .otp-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .risk-summary-callout {
          background: rgba(244, 63, 94, 0.1);
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          font-size: 0.78rem;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          text-align: left;
        }
        .demo-otp-banner {
          background: rgba(6, 182, 212, 0.15);
          border: 1px dashed var(--cyan);
          color: var(--cyan);
          padding: 8px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 16px;
        }
        .otp-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .delivery-selector {
          display: flex;
          gap: 8px;
        }
        .delivery-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.78rem;
          cursor: pointer;
        }
        .delivery-btn.active {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--primary);
          color: var(--text-main);
          font-weight: 600;
        }
        .otp-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(15, 23, 42, 0.8);
          border: 2px solid var(--primary);
          border-radius: var(--radius-md);
          padding: 4px 16px;
        }
        .otp-code-input {
          width: 100%;
          border: none;
          background: transparent;
          color: var(--text-main);
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: 0.35em;
          text-align: center;
          outline: none;
        }
        .error-banner {
          color: var(--rose);
          font-size: 0.8rem;
        }
        .verify-btn {
          width: 100%;
          padding: 12px;
        }
        .resend-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-top: 4px;
        }
        .btn-link {
          background: none;
          border: none;
          color: var(--cyan);
          cursor: pointer;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .timer-text {
          color: var(--text-muted);
        }
      `}</style>
        </div>
    );
}
