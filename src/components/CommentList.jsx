import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { ArrowUpDown, MessageSquare } from 'lucide-react';

export default function CommentList({ comments, onVote, onReport, onAddReply }) {
    const [sortBy, setSortBy] = useState('newest');

    const getSortedComments = () => {
        const active = comments.filter((c) => c.isModerated && !c.isReported);

        return [...active].sort((a, b) => {
            if (sortBy === 'popular') {
                return (b.likes || 0) - (a.likes || 0);
            }
            return 0; // Default order
        });
    };

    const sortedList = getSortedComments();

    return (
        <div className="comment-list-container">
            <div className="comment-list-header">
                <div className="comment-count-badge">
                    <MessageSquare size={18} className="text-cyan" />
                    <span><strong>{sortedList.length}</strong> Public Comments</span>
                </div>

                <div className="sort-box">
                    <ArrowUpDown size={14} className="text-muted" />
                    <select className="sort-dropdown" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="popular">Top Liked</option>
                    </select>
                </div>
            </div>

            <div className="comments-items-wrapper">
                {sortedList.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onVote={onVote}
                        onReport={onReport}
                        onAddReply={onAddReply}
                    />
                ))}
            </div>

            <style>{`
        .comment-list-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .comment-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 10px;
        }
        .comment-count-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
        }
        .sort-box {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 4px 10px;
        }
        .sort-dropdown {
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 0.8rem;
          outline: none;
          cursor: pointer;
        }
        .sort-dropdown option {
          background: #0f172a;
          color: white;
        }
        .comments-items-wrapper {
          display: flex;
          flex-direction: column;
        }
      `}</style>
        </div>
    );
}
