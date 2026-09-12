import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkCommentSafety } from '../utils/moderation';
import { SUPPORTED_LANGUAGES } from '../utils/translation';
import { Eye, EyeOff, Send, ShieldAlert, Globe, Info } from 'lucide-react';

export default function CommentForm({ onAddComment, onOpenSafetyRules }) {
    const { user } = useAuth();

    const [text, setText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [hideLocation, setHideLocation] = useState(false);
    const [safetyNotice, setSafetyNotice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        // Run moderation check
        const result = checkCommentSafety(text);

        if (!result.isValid) {
            setSafetyNotice(result.blockedReasonText);
            return;
        }

        setSafetyNotice('');

        const newComment = {
            id: `c_${Date.now()}`,
            author: user.name,
            avatar: user.avatar,
            text: text.trim(),
            language: selectedLanguage,
            timestamp: 'Just now',
            likes: 0,
            dislikes: 0,
            isHearted: false,
            userVote: null,
            isModerated: true,
            isReported: false,
            reportCount: 0,
            location: {
                city: user.lastLoginRegion?.city || 'Mumbai',
                country: user.lastLoginRegion?.country || 'India',
                isHidden: hideLocation,
            },
            replies: [],
        };

        onAddComment(newComment);
        setText('');
    };

    return (
        <div className="comment-form-container glass-panel">
            <form onSubmit={handleSubmit} className="comment-form">
                <div className="form-top-row">
                    <img src={user.avatar} alt={user.name} className="form-avatar" />

                    <div className="input-field-wrap">
                        <textarea
                            className="comment-textarea"
                            placeholder="Add a public comment (Multilingual & Auto-Moderated)..."
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                                if (safetyNotice) setSafetyNotice('');
                            }}
                            rows={2}
                            required
                        />
                    </div>
                </div>

                {safetyNotice && (
                    <div className="safety-error-callout">
                        <ShieldAlert size={16} />
                        <span>{safetyNotice}</span>
                    </div>
                )}

                <div className="form-bottom-toolbar">
                    <div className="controls-group">
                        {/* Language Selector */}
                        <div className="lang-select-box">
                            <Globe size={14} className="text-cyan" />
                            <select
                                className="lang-dropdown"
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.flag} {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location Privacy Toggle */}
                        <button
                            type="button"
                            className={`privacy-toggle-btn ${hideLocation ? 'hidden-active' : ''}`}
                            onClick={() => setHideLocation(!hideLocation)}
                            title={hideLocation ? 'Location Hidden for Privacy' : 'Location Visible'}
                        >
                            {hideLocation ? <EyeOff size={14} className="text-amber-400" /> : <Eye size={14} className="text-cyan" />}
                            <span>{hideLocation ? 'Location: Hidden' : 'Location: Visible'}</span>
                        </button>

                        <button type="button" className="btn-link-info" onClick={onOpenSafetyRules}>
                            <Info size={14} /> Rules
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary post-btn">
                        <Send size={15} />
                        <span>Comment</span>
                    </button>
                </div>
            </form>

            <style>{`
        .comment-form-container {
          padding: 16px;
          margin-bottom: 20px;
        }
        .comment-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .form-top-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .form-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .input-field-wrap {
          flex: 1;
        }
        .comment-textarea {
          width: 100%;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 10px 14px;
          color: var(--text-main);
          font-family: var(--font-family);
          font-size: 0.88rem;
          resize: vertical;
          outline: none;
        }
        .comment-textarea:focus {
          border-color: var(--cyan);
          background: rgba(30, 41, 59, 0.8);
        }
        .safety-error-callout {
          background: rgba(244, 63, 94, 0.15);
          border: 1px solid var(--rose);
          color: #ff4d6d;
          padding: 10px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-bottom-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .controls-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lang-select-box {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 4px 8px;
        }
        .lang-dropdown {
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 0.8rem;
          outline: none;
          cursor: pointer;
        }
        .lang-dropdown option {
          background: #0f172a;
          color: white;
        }
        .privacy-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 6px 10px;
          color: var(--text-muted);
          font-size: 0.78rem;
          cursor: pointer;
        }
        .privacy-toggle-btn.hidden-active {
          border-color: var(--amber);
          color: var(--amber);
        }
        .btn-link-info {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.78rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .post-btn {
          padding: 8px 16px;
          font-size: 0.85rem;
        }
      `}</style>
        </div>
    );
}
