import React, { useState } from 'react';
import { translateText, getLanguageName, SUPPORTED_LANGUAGES } from '../utils/translation';
import { ThumbsUp, ThumbsDown, Heart, Globe, MapPin, EyeOff, Flag, CornerDownRight, Languages } from 'lucide-react';

export default function CommentItem({ comment, onVote, onReport, onAddReply }) {
  const [translatedText, setTranslatedText] = useState(null);
  const [targetLang, setTargetLang] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleTranslate = (toLang) => {
    if (!toLang) return;
    setTargetLang(toLang);
    setIsTranslating(true);

    const res = translateText(comment.text, toLang, comment.language || 'en');
    setTranslatedText(res.translatedText);
    setIsTranslating(false);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onAddReply(comment.id, replyText.trim());
    setReplyText('');
    setShowReplyBox(false);
  };

  return (
    <div className="comment-item-card">
      <img src={comment.avatar} alt={comment.author} className="comment-avatar" />

      <div className="comment-main-content">
        <div className="comment-meta-row">
          <div className="author-name-group">
            <span className="author-name">{comment.author}</span>
            <span className="comment-time">{comment.timestamp}</span>

            {/* Location Privacy Badge */}
            {comment.location && (
              <span className="location-pill">
                {comment.location.isHidden ? (
                  <>
                    <EyeOff size={11} className="text-amber-400" />
                    <span>Location Hidden</span>
                  </>
                ) : (
                  <>
                    <MapPin size={11} className="text-cyan-400" />
                    <span>{comment.location.city}, {comment.location.country}</span>
                  </>
                )}
              </span>
            )}
          </div>

          <button className="report-btn" onClick={() => onReport(comment)} title="Report Comment">
            <Flag size={13} />
          </button>
        </div>

        {/* Comment Body Text */}
        <p className="comment-text-body">
          {translatedText || comment.text}
        </p>

        {translatedText && (
          <div className="translation-indicator">
            <Languages size={13} />
            <span>Translated to <strong>{getLanguageName(targetLang)}</strong> • </span>
            <button
              className="undo-trans-btn"
              onClick={() => {
                setTranslatedText(null);
                setTargetLang('');
              }}
            >
              Show Original
            </button>
          </div>
        )}

        {/* Comment Action Toolbar */}
        <div className="comment-actions-bar">
          <button
            className={`vote-btn ${comment.userVote === 'like' ? 'active-like' : ''}`}
            onClick={() => onVote(comment.id, 'like')}
          >
            <ThumbsUp size={14} />
            <span>{comment.likes}</span>
          </button>

          <button
            className={`vote-btn ${comment.userVote === 'dislike' ? 'active-dislike' : ''}`}
            onClick={() => onVote(comment.id, 'dislike')}
          >
            <ThumbsDown size={14} />
          </button>

          {comment.isHearted && (
            <span className="heart-badge" title="Hearted by Creator">
              <Heart size={14} className="text-rose-400 fill-rose-400" />
            </span>
          )}

          {/* Translation Dropdown */}
          <div className="quick-trans-box">
            <Globe size={13} className="text-cyan" />
            <select
              className="mini-lang-select"
              value={targetLang}
              onChange={(e) => handleTranslate(e.target.value)}
            >
              <option value="" disabled>Translate to...</option>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button className="reply-btn-toggle" onClick={() => setShowReplyBox(!showReplyBox)}>
            Reply
          </button>
        </div>

        {/* Reply Input Box */}
        {showReplyBox && (
          <form onSubmit={handleReplySubmit} className="reply-form-box">
            <input
              type="text"
              className="reply-input"
              placeholder={`Reply to ${comment.author}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-cyan btn-sm">
              Reply
            </button>
          </form>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies-nested-container">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="reply-item">
                <CornerDownRight size={14} className="text-muted reply-arrow" />
                <img src={reply.avatar} alt={reply.author} className="reply-avatar" />
                <div className="reply-content">
                  <div className="reply-meta">
                    <strong>{reply.author}</strong>
                    <span className="reply-time">{reply.timestamp}</span>
                  </div>
                  <p className="reply-text">{reply.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .comment-item-card {
          display: flex;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid var(--border-glass);
        }
        .comment-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
        }
        .comment-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .comment-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .author-name-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .author-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--text-main);
        }
        .comment-time {
          font-size: 0.75rem;
          color: var(--text-dim);
        }
        .location-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(30, 41, 59, 0.6);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .report-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 2px;
        }
        .report-btn:hover {
          color: var(--rose);
        }
        .comment-text-body {
          font-size: 0.88rem;
          color: var(--text-main);
          line-height: 1.4;
        }
        .translation-indicator {
          font-size: 0.75rem;
          color: var(--cyan);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }
        .undo-trans-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          text-decoration: underline;
          cursor: pointer;
          font-size: 0.75rem;
        }
        .comment-actions-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
        }
        .vote-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
        }
        .vote-btn.active-like { color: var(--cyan); font-weight: 700; }
        .vote-btn.active-dislike { color: var(--rose); font-weight: 700; }

        .quick-trans-box {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 2px 6px;
        }
        .mini-lang-select {
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 0.75rem;
          outline: none;
          cursor: pointer;
        }
        .mini-lang-select option {
          background: #0f172a;
          color: white;
        }
        .reply-btn-toggle {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
        }
        .reply-form-box {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .reply-input {
          flex: 1;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 6px 12px;
          color: var(--text-main);
          font-size: 0.8rem;
          outline: none;
        }
        .replies-nested-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
          padding-left: 8px;
          border-left: 2px solid var(--border-glass);
        }
        .reply-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.82rem;
        }
        .reply-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }
        .reply-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .reply-time {
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .reply-text {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
