import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, MessageSquare, X, Info, Crown } from 'lucide-react';

const QUICK_EMOJIS = ['😀', '😂', '🔥', '😍', '🍿', '😮', '👏', '🎉', '👍', '💯'];

export default function ChatSidebar({
    messages,
    onSendMessage,
    onClose,
    currentUserId
}) {
    const [text, setText] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const chatBottomRef = useRef(null);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSendMessage(text.trim());
        setText('');
        setShowEmojis(false);
    };

    const handleAddEmoji = (emoji) => {
        setText(prev => prev + emoji);
    };

    return (
        <aside className="glass-panel chat-sidebar-container">
            <div className="chat-header">
                <div className="chat-header-title">
                    <MessageSquare size={18} className="text-cyan" />
                    <h3>Party Chat</h3>
                </div>
                <button className="chat-close-btn" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            {/* Message List */}
            <div className="chat-messages-area">
                {messages.length === 0 ? (
                    <div className="chat-empty-state">
                        <MessageSquare size={32} className="text-dim" />
                        <p>No messages yet. Say hi to your friends!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        if (msg.isSystem) {
                            return (
                                <div key={idx} className="system-msg">
                                    <Info size={13} className="text-cyan" />
                                    <span>{msg.text}</span>
                                </div>
                            );
                        }

                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={idx} className={`chat-bubble-wrap ${isMe ? 'mine' : 'other'}`}>
                                {!isMe && (
                                    <span className="sender-avatar">{msg.avatar || '🍿'}</span>
                                )}

                                <div className="chat-bubble">
                                    {!isMe && (
                                        <div className="sender-name">
                                            {msg.senderName}
                                            {msg.isHost && <Crown size={11} className="text-amber" title="Host" />}
                                        </div>
                                    )}
                                    <p className="msg-text">{msg.text}</p>
                                    <span className="msg-time">{msg.time}</span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatBottomRef} />
            </div>

            {/* Emoji Picker Popup */}
            {showEmojis && (
                <div className="emoji-picker-pop">
                    {QUICK_EMOJIS.map((emoji, i) => (
                        <button
                            key={i}
                            type="button"
                            className="emoji-select-btn"
                            onClick={() => handleAddEmoji(emoji)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Box */}
            <form onSubmit={handleSubmit} className="chat-input-form">
                <button
                    type="button"
                    className="emoji-toggle-btn"
                    onClick={() => setShowEmojis(!showEmojis)}
                >
                    <Smile size={18} />
                </button>

                <input
                    type="text"
                    className="input-field chat-field"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button type="submit" className="btn btn-primary send-btn" disabled={!text.trim()}>
                    <Send size={16} />
                </button>
            </form>

            <style>{`
        .chat-sidebar-container {
          width: 320px;
          height: calc(100vh - 100px);
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 80;
          display: flex;
          flex-direction: column;
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
          border: 1px solid var(--border-glass);
          animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-glass);
        }
        .chat-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .chat-header h3 {
          font-size: 1.05rem;
          font-weight: 700;
        }
        .chat-close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .chat-messages-area {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-empty-state {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 8px;
          color: var(--text-dim);
          font-size: 0.88rem;
        }
        .system-msg {
          align-self: center;
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid var(--border-glass);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .chat-bubble-wrap {
          display: flex;
          gap: 8px;
          max-width: 85%;
        }
        .chat-bubble-wrap.mine {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .chat-bubble-wrap.other {
          align-self: flex-start;
        }
        .sender-avatar {
          font-size: 1.2rem;
        }
        .chat-bubble {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid var(--border-glass);
          padding: 8px 12px;
          border-radius: var(--radius-md);
          position: relative;
        }
        .mine .chat-bubble {
          background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%);
          border: none;
        }
        .sender-name {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--cyan);
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .msg-text {
          font-size: 0.88rem;
          word-break: break-word;
          color: var(--text-main);
        }
        .msg-time {
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.5);
          float: right;
          margin-top: 4px;
          margin-left: 8px;
        }
        .emoji-picker-pop {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
          padding: 10px;
          background: rgba(15, 23, 42, 0.95);
          border-top: 1px solid var(--border-glass);
        }
        .emoji-select-btn {
          background: none;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          border-radius: 6px;
          padding: 4px;
        }
        .emoji-select-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .chat-input-form {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px;
          border-top: 1px solid var(--border-glass);
          background: rgba(15, 23, 42, 0.9);
        }
        .emoji-toggle-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
        }
        .chat-field {
          padding: 8px 12px;
          font-size: 0.88rem;
        }
        .send-btn {
          width: 38px;
          height: 38px;
          padding: 0;
          border-radius: var(--radius-md);
        }
        @media (max-width: 768px) {
          .chat-sidebar-container {
            width: 100%;
            height: 50vh;
            top: auto;
            bottom: 80px;
            right: 0;
            left: 0;
            border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          }
        }
      `}</style>
        </aside>
    );
}
