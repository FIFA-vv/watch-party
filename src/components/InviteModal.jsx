import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2, X, Sparkles } from 'lucide-react';

export default function InviteModal({ roomId, onClose }) {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    const roomUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(roomUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomId);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 3000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content invite-card">
                <button className="close-modal-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="invite-header">
                    <div className="invite-icon">
                        <Share2 size={24} />
                    </div>
                    <h2>Invite Friends</h2>
                    <p>Share this link or QR code with friends to join your watch party in real time!</p>
                </div>

                {/* QR Code Container */}
                <div className="qr-container">
                    <div className="qr-border">
                        <QRCodeSVG
                            value={roomUrl}
                            size={150}
                            bgColor="#0f172a"
                            fgColor="#ffffff"
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                    <span className="qr-label">Scan with Phone Camera to Join</span>
                </div>

                {/* Copy Link Section */}
                <div className="copy-group">
                    <label>Direct Party Link</label>
                    <div className="copy-box">
                        <input type="text" readOnly value={roomUrl} className="input-field copy-input" />
                        <button className="btn btn-primary copy-btn" onClick={handleCopyLink}>
                            {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

                {/* Copy Code Section */}
                <div className="copy-group">
                    <label>Room Code</label>
                    <div className="copy-box">
                        <input type="text" readOnly value={roomId} className="input-field copy-input code-font" />
                        <button className="btn btn-secondary copy-btn" onClick={handleCopyCode}>
                            {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .invite-card {
          max-width: 440px;
          text-align: center;
        }
        .close-modal-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .invite-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--cyan) 0%, #0891b2 100%);
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 12px;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
        }
        .invite-header h2 {
          font-size: 1.4rem;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .invite-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .qr-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .qr-border {
          padding: 12px;
          background: #0f172a;
          border: 2px solid var(--cyan);
          border-radius: var(--radius-md);
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
        }
        .qr-label {
          font-size: 0.78rem;
          color: var(--text-dim);
        }
        .copy-group {
          text-align: left;
          margin-bottom: 14px;
        }
        .copy-group label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 4px;
        }
        .copy-box {
          display: flex;
          gap: 8px;
        }
        .copy-input {
          font-size: 0.85rem;
          padding: 8px 12px;
        }
        .code-font {
          font-family: monospace;
          letter-spacing: 0.1em;
          font-weight: 700;
        }
        .copy-btn {
          padding: 8px 16px;
          white-space: nowrap;
        }
      `}</style>
        </div>
    );
}
