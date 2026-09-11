import React from 'react';
import { Film, Users, Share2, LogOut, Radio, Crown, ShieldAlert } from 'lucide-react';

export default function Navbar({
    roomId,
    isHost,
    participantCount,
    onOpenInvite,
    onLeaveCall,
    onToggleParticipants,
    isRecording
}) {
    return (
        <header className="navbar-container">
            <div className="navbar-left">
                <div className="brand-logo">
                    <div className="brand-icon">
                        <Film size={22} className="icon-pulse" />
                    </div>
                    <span className="brand-name">
                        Cine<span className="brand-highlight">Sync</span>
                    </span>
                </div>

                {roomId && (
                    <div className="room-badge-group">
                        <div className="room-id-badge">
                            <Radio size={14} className="text-cyan animate-pulse" />
                            <span className="room-id-text">Room: <strong>{roomId}</strong></span>
                        </div>

                        {isHost ? (
                            <span className="badge badge-host">
                                <Crown size={12} /> Host
                            </span>
                        ) : (
                            <span className="badge badge-live">Guest</span>
                        )}

                        {isRecording && (
                            <span className="badge badge-rec">
                                ● REC
                            </span>
                        )}
                    </div>
                )}
            </div>

            {roomId && (
                <div className="navbar-right">
                    <button className="btn btn-secondary nav-btn" onClick={onToggleParticipants} title="Participant List">
                        <Users size={18} />
                        <span className="participant-count-badge">{participantCount}</span>
                    </button>

                    <button className="btn btn-cyan nav-btn" onClick={onOpenInvite}>
                        <Share2 size={16} />
                        <span>Invite Friends</span>
                    </button>

                    <button className="btn btn-danger nav-btn" onClick={onLeaveCall} title="Leave Watch Party">
                        <LogOut size={16} />
                        <span className="hide-mobile">Leave</span>
                    </button>
                </div>
            )}

            <style>{`
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-glass);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-left, .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 1.35rem;
          letter-spacing: -0.02em;
        }
        .brand-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--cyan) 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
        }
        .brand-highlight {
          color: var(--cyan);
        }
        .room-badge-group {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 16px;
          border-left: 1px solid var(--border-glass);
        }
        .room-id-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(30, 41, 59, 0.6);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-glass);
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .room-id-text strong {
          color: var(--text-main);
          font-family: monospace;
          letter-spacing: 0.05em;
        }
        .nav-btn {
          padding: 8px 14px;
          font-size: 0.88rem;
        }
        .participant-count-badge {
          background: rgba(139, 92, 246, 0.3);
          color: var(--text-main);
          padding: 2px 7px;
          border-radius: 10px;
          font-size: 0.78rem;
          font-weight: 700;
        }
        @media (max-width: 768px) {
          .navbar-container {
            padding: 10px 14px;
          }
          .room-badge-group {
            display: none;
          }
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
        </header>
    );
}
