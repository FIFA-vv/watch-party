import React from 'react';
import { ShieldAlert, CheckCircle, Trash2, Flag, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ModeratorPanel({ comments, onApproveComment, onDeleteComment, onResetDemoComments }) {
    const flaggedComments = comments.filter((c) => c.isReported || !c.isModerated || (c.dislikes && c.dislikes > 3));

    return (
        <div className="moderator-panel-container glass-panel">
            <div className="mod-header">
                <div className="mod-title">
                    <ShieldAlert size={22} className="text-rose-400" />
                    <div>
                        <h3>Community Moderator Dashboard</h3>
                        <p>Review auto-flagged toxic content, reported posts, and high-dislike comments.</p>
                    </div>
                </div>

                <button className="btn btn-secondary btn-sm" onClick={onResetDemoComments}>
                    <RefreshCw size={14} /> Reset Demo Comments
                </button>
            </div>

            <div className="mod-stats-row">
                <div className="mod-stat-card">
                    <span className="stat-num">{comments.length}</span>
                    <span className="stat-label">Total Comments</span>
                </div>
                <div className="mod-stat-card border-rose">
                    <span className="stat-num text-rose-400">{flaggedComments.length}</span>
                    <span className="stat-label">Pending Review</span>
                </div>
                <div className="mod-stat-card border-emerald">
                    <span className="stat-num text-emerald-400">{comments.length - flaggedComments.length}</span>
                    <span className="stat-label">Approved & Active</span>
                </div>
            </div>

            {flaggedComments.length === 0 ? (
                <div className="empty-mod-state">
                    <CheckCircle size={36} className="text-emerald-400" />
                    <h4>All Clean!</h4>
                    <p>No flagged or reported comments requiring review right now.</p>
                </div>
            ) : (
                <div className="flagged-list">
                    {flaggedComments.map((comment) => (
                        <div key={comment.id} className="flagged-card">
                            <div className="flagged-top">
                                <div className="author-group">
                                    <img src={comment.avatar} alt={comment.author} className="author-avatar" />
                                    <div>
                                        <strong>{comment.author}</strong>
                                        <span className="post-time">{comment.timestamp}</span>
                                    </div>
                                </div>

                                <div className="flag-badges-group">
                                    {comment.isReported && (
                                        <span className="badge badge-rec"><Flag size={12} /> Reported ({comment.reportCount})</span>
                                    )}
                                    {!comment.isModerated && (
                                        <span className="badge badge-host"><AlertTriangle size={12} /> Auto-Flagged</span>
                                    )}
                                </div>
                            </div>

                            <div className="comment-body-text">
                                "{comment.text}"
                            </div>

                            {comment.blockedReasonText && (
                                <div className="reason-callout">
                                    ⚠️ {comment.blockedReasonText}
                                </div>
                            )}

                            <div className="flagged-actions">
                                <button className="btn btn-secondary btn-sm" onClick={() => onApproveComment(comment.id)}>
                                    <CheckCircle size={14} className="text-emerald-400" /> Approve & Restore
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => onDeleteComment(comment.id)}>
                                    <Trash2 size={14} /> Remove Permanently
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        .moderator-panel-container {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }
        .mod-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 16px;
        }
        .mod-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mod-title h3 {
          font-size: 1.2rem;
          font-weight: 700;
        }
        .mod-title p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .mod-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .mod-stat-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .mod-stat-card.border-rose { border-color: rgba(244, 63, 94, 0.4); }
        .mod-stat-card.border-emerald { border-color: rgba(16, 185, 129, 0.4); }

        .stat-num {
          font-size: 1.6rem;
          font-weight: 800;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .empty-mod-state {
          padding: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
        }
        .flagged-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .flagged-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .flagged-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .author-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .author-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
        .post-time {
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-left: 8px;
        }
        .flag-badges-group {
          display: flex;
          gap: 6px;
        }
        .comment-body-text {
          font-size: 0.9rem;
          color: var(--text-main);
          font-style: italic;
          background: rgba(30, 41, 59, 0.4);
          padding: 10px;
          border-radius: var(--radius-sm);
        }
        .reason-callout {
          font-size: 0.78rem;
          color: var(--rose);
        }
        .flagged-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
      `}</style>
        </div>
    );
}
