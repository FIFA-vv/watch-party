import React from 'react';
import { Users, Crown, MicOff, VideoOff, Hand, X, UserX } from 'lucide-react';

export default function ParticipantList({
    participants, // Array of { id, name, avatar, isHost, isMuted, isCameraOff, isHandRaised }
    currentUserId,
    isHost,
    onKickUser,
    onClose
}) {
    return (
        <aside className="glass-panel participant-drawer">
            <div className="drawer-header">
                <div className="drawer-title">
                    <Users size={18} className="text-cyan" />
                    <h3>Participants ({participants.length})</h3>
                </div>
                <button className="close-btn" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            <div className="participant-items-list">
                {participants.map((p) => {
                    const isMe = p.id === currentUserId;
                    return (
                        <div key={p.id} className="participant-card">
                            <div className="p-avatar-box">
                                <span className="p-emoji">{p.avatar || '🍿'}</span>
                                {p.isHost && <Crown size={12} className="crown-badge" />}
                            </div>

                            <div className="p-details">
                                <span className="p-name">
                                    {p.name} {isMe ? '(You)' : ''}
                                </span>
                                <span className="p-role">
                                    {p.isHost ? 'Party Host' : 'Guest'}
                                </span>
                            </div>

                            <div className="p-status-row">
                                {p.isHandRaised && <Hand size={15} className="text-cyan animate-bounce" title="Raised Hand" />}
                                {p.isMuted && <MicOff size={15} className="text-rose" title="Muted" />}
                                {p.isCameraOff && <VideoOff size={15} className="text-muted" title="Camera Off" />}

                                {isHost && !isMe && (
                                    <button
                                        className="kick-btn"
                                        onClick={() => onKickUser(p.id)}
                                        title="Remove from Room"
                                    >
                                        <UserX size={15} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
        .participant-drawer {
          width: 300px;
          height: calc(100vh - 100px);
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 85;
          display: flex;
          flex-direction: column;
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
          border: 1px solid var(--border-glass);
          animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-glass);
        }
        .drawer-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .drawer-header h3 {
          font-size: 1.05rem;
          font-weight: 700;
        }
        .participant-items-list {
          flex: 1;
          padding: 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .participant-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
        }
        .p-avatar-box {
          position: relative;
          width: 38px;
          height: 38px;
          background: rgba(15, 23, 42, 0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .crown-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          color: var(--amber);
        }
        .p-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .p-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .p-role {
          font-size: 0.72rem;
          color: var(--text-dim);
        }
        .p-status-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .kick-btn {
          background: none;
          border: none;
          color: var(--rose);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        .kick-btn:hover {
          opacity: 1;
          background: rgba(244, 63, 94, 0.2);
        }
      `}</style>
        </aside>
    );
}
