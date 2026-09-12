import React, { useState } from 'react';
import { Share2, Copy, Check, Users } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, roomId, videoTitle }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareUrl = window.location.origin + (roomId ? `?room=${roomId}` : '');

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content share-modal-box">
                <div className="share-header">
                    <Share2 size={20} className="text-cyan" />
                    <h3>Share Video & Watch Party</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {roomId && (
                    <div className="room-id-banner">
                        <Users size={16} className="text-purple-400" />
                        <span>Active Room Code: <strong>{roomId}</strong></span>
                    </div>
                )}

                <p className="share-text-intro">
                    Copy this link to invite friends to stream "{videoTitle}" in real-time sync with video/audio call:
                </p>

                <div className="copy-link-box">
                    <input type="text" className="share-input" value={shareUrl} readOnly />
                    <button className="btn btn-primary btn-sm" onClick={handleCopy}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
            </div>

            <style>{`
        .share-modal-box {
          max-width: 440px;
        }
        .share-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
          margin-bottom: 14px;
        }
        .share-header h3 {
          font-size: 1.05rem;
          font-weight: 700;
        }
        .room-id-banner {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid var(--primary);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .share-text-intro {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 12px;
        }
        .copy-link-box {
          display: flex;
          gap: 8px;
        }
        .share-input {
          flex: 1;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          color: var(--text-main);
          font-size: 0.8rem;
          outline: none;
        }
      `}</style>
        </div>
    );
}
