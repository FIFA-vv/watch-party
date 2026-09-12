import React, { useState } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import ModeratorPanel from './ModeratorPanel';
import SafetyRulesModal from './SafetyRulesModal';
import ReportModal from './ReportModal';
import { INITIAL_COMMENTS } from '../data/mockComments';
import { ShieldAlert, MessageSquare, Sparkles } from 'lucide-react';

export default function CommentsSection() {
    const [comments, setComments] = useState(INITIAL_COMMENTS);
    const [showModeratorPanel, setShowModeratorPanel] = useState(false);
    const [showSafetyRules, setShowSafetyRules] = useState(false);
    const [reportingComment, setReportingComment] = useState(null);

    const handleAddComment = (newComment) => {
        setComments((prev) => [newComment, ...prev]);
    };

    const handleVote = (commentId, type) => {
        setComments((prev) =>
            prev.map((c) => {
                if (c.id !== commentId) return c;
                const isCurrentLike = c.userVote === 'like';
                const isCurrentDislike = c.userVote === 'dislike';

                if (type === 'like') {
                    return {
                        ...c,
                        userVote: isCurrentLike ? null : 'like',
                        likes: isCurrentLike ? c.likes - 1 : c.likes + 1,
                        dislikes: isCurrentDislike ? c.dislikes - 1 : c.dislikes,
                    };
                } else {
                    return {
                        ...c,
                        userVote: isCurrentDislike ? null : 'dislike',
                        dislikes: isCurrentDislike ? c.dislikes - 1 : c.dislikes + 1,
                        likes: isCurrentLike ? c.likes - 1 : c.likes,
                    };
                }
            })
        );
    };

    const handleOpenReportModal = (comment) => {
        setReportingComment(comment);
    };

    const handleConfirmReport = (commentId, reason) => {
        setComments((prev) =>
            prev.map((c) => {
                if (c.id === commentId) {
                    return {
                        ...c,
                        isReported: true,
                        reportCount: (c.reportCount || 0) + 1,
                        blockedReasonText: `Reported by community for: ${reason}`,
                    };
                }
                return c;
            })
        );
    };

    const handleAddReply = (commentId, replyText) => {
        const newReply = {
            id: `r_${Date.now()}`,
            author: 'Alex Rivera',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            text: replyText,
            timestamp: 'Just now',
        };

        setComments((prev) =>
            prev.map((c) => {
                if (c.id === commentId) {
                    return {
                        ...c,
                        replies: [...(c.replies || []), newReply],
                    };
                }
                return c;
            })
        );
    };

    const handleApproveComment = (commentId) => {
        setComments((prev) =>
            prev.map((c) => (c.id === commentId ? { ...c, isModerated: true, isReported: false } : c))
        );
    };

    const handleDeleteComment = (commentId) => {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    const handleResetDemoComments = () => {
        setComments(INITIAL_COMMENTS);
    };

    return (
        <div className="comments-section-container">
            <div className="comments-header-row">
                <h3>Community Comments & Multilingual Discussion</h3>

                <button
                    className={`btn btn-sm ${showModeratorPanel ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => setShowModeratorPanel(!showModeratorPanel)}
                >
                    <ShieldAlert size={14} />
                    <span>{showModeratorPanel ? 'Hide Moderator Dashboard' : 'Moderator Dashboard'}</span>
                </button>
            </div>

            {showModeratorPanel && (
                <ModeratorPanel
                    comments={comments}
                    onApproveComment={handleApproveComment}
                    onDeleteComment={handleDeleteComment}
                    onResetDemoComments={handleResetDemoComments}
                />
            )}

            <CommentForm onAddComment={handleAddComment} onOpenSafetyRules={() => setShowSafetyRules(true)} />

            <CommentList
                comments={comments}
                onVote={handleVote}
                onReport={handleOpenReportModal}
                onAddReply={handleAddReply}
            />

            <SafetyRulesModal isOpen={showSafetyRules} onClose={() => setShowSafetyRules(false)} />

            <ReportModal
                comment={reportingComment}
                isOpen={Boolean(reportingComment)}
                onClose={() => setReportingComment(null)}
                onConfirmReport={handleConfirmReport}
            />

            <style>{`
        .comments-section-container {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .comments-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
        }
        .comments-header-row h3 {
          font-size: 1.15rem;
          font-weight: 700;
        }
      `}</style>
        </div>
    );
}
