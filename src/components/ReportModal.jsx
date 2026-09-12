import React, { useState } from 'react';
import { Flag, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ReportModal({ comment, isOpen, onClose, onConfirmReport }) {
    const [reason, setReason] = useState('Abusive/Offensive Language');

    if (!isOpen || !comment) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirmReport(comment.id, reason);
        onClose();
    };

    const reportReasons = [
        'Abusive/Offensive Language',
        'Spam or Promotional Advertising',
        'Harassment or Bullying',
        'Misinformation or Scam',
        'Excessive Symbols / Annoying Content',
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content report-modal-box">
                <div className="report-header">
                    <Flag size={20} className="text-rose-400" />
                    <h3>Report Comment for Review</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="comment-preview-box">
                    <span className="author-name">{comment.author}:</span>
                    <p className="comment-text">"{comment.text}"</p>
                </div>

                <form onSubmit={handleSubmit} className="report-form">
                    <label className="section-label">Select Violation Reason</label>
                    <div className="reasons-list">
                        {reportReasons.map((r) => (
                            <label key={r} className={`reason-item ${reason === r ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="reportReason"
                                    value={r}
                                    checked={reason === r}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <span>{r}</span>
                            </label>
                        ))}
                    </div>

                    <div className="report-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-danger">
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        .report-modal-box {
          max-width: 440px;
        }
        .report-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
          margin-bottom: 14px;
        }
        .report-header h3 {
          font-size: 1.05rem;
          font-weight: 700;
        }
        .comment-preview-box {
          background: rgba(30, 41, 59, 0.6);
          border-left: 3px solid var(--rose);
          padding: 10px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          margin-bottom: 16px;
        }
        .author-name {
          font-weight: 700;
          color: var(--text-main);
          display: block;
        }
        .comment-text {
          color: var(--text-muted);
          font-style: italic;
          margin-top: 2px;
        }
        .report-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .reasons-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .reason-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-glass);
          padding: 10px 12px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          cursor: pointer;
        }
        .reason-item.active {
          border-color: var(--rose);
          background: rgba(244, 63, 94, 0.1);
        }
        .report-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 6px;
        }
      `}</style>
        </div>
    );
}
