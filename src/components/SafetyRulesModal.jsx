import React from 'react';
import { ShieldCheck, AlertOctagon, Sparkles, Lock, EyeOff } from 'lucide-react';

export default function SafetyRulesModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content safety-modal-box">
                <div className="safety-header">
                    <ShieldCheck size={28} className="text-cyan" />
                    <div>
                        <h3>Community Safety & Moderation Guidelines</h3>
                        <p>Our automated safety engine keeps WeTube respectful and constructive.</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="rules-list">
                    <div className="rule-card">
                        <AlertOctagon size={20} className="text-rose-400" />
                        <div>
                            <strong>1. Zero Tolerance for Toxicity & Hate Speech</strong>
                            <p>Posts containing profanity, hate slurs, or harassment are automatically blocked by the real-time AI moderation filter.</p>
                        </div>
                    </div>

                    <div className="rule-card">
                        <Sparkles size={20} className="text-amber-400" />
                        <div>
                            <strong>2. Anti-Spam & Character Spam Protection</strong>
                            <p>Promotional links, crypto spam, sub4sub, and excessive repeated special characters (e.g. "!!!!", "????", "% % %") are prohibited.</p>
                        </div>
                    </div>

                    <div className="rule-card">
                        <EyeOff size={20} className="text-cyan" />
                        <div>
                            <strong>3. Location Privacy Control</strong>
                            <p>You can toggle your city/country location privacy at any time. When hidden, only your avatar and display name are shown.</p>
                        </div>
                    </div>

                    <div className="rule-card">
                        <Lock size={20} className="text-emerald-400" />
                        <div>
                            <strong>4. Community Reporting & Moderator Review</strong>
                            <p>Reported comments are flagged for human moderator review. Community members can inspect and clear or remove flagged items in the Moderator Dashboard.</p>
                        </div>
                    </div>
                </div>

                <button className="btn btn-primary close-safety-btn" onClick={onClose}>
                    I Understand & Agree
                </button>
            </div>

            <style>{`
        .safety-modal-box {
          max-width: 520px;
        }
        .safety-header {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 14px;
          margin-bottom: 16px;
        }
        .safety-header h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }
        .safety-header p {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .rule-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 12px;
          font-size: 0.82rem;
        }
        .rule-card strong {
          display: block;
          margin-bottom: 2px;
          color: var(--text-main);
        }
        .rule-card p {
          color: var(--text-muted);
          line-height: 1.35;
        }
        .close-safety-btn {
          width: 100%;
          padding: 10px;
        }
      `}</style>
        </div>
    );
}
