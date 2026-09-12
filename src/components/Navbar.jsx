import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import {
  Menu, Search, Mic, Upload, Users, Shield, Crown, Bell,
  User, Sun, Moon, Sparkles, CheckCircle2, ShieldAlert
} from 'lucide-react';

export default function Navbar({
  onToggleSidebar,
  onGoHome,
  searchQuery,
  setSearchQuery,
  onOpenVoiceSearch,
  onOpenUpload,
  onOpenShare,
  onJoinRoom,
  roomConnected,
  roomId,
  peersCount,
}) {
  const { user, isAuthenticated, currentTheme, setIsAuthModalOpen, setIsProfileModalOpen } = useAuth();
  const { subscription, activePlanDetails, setIsPricingModalOpen } = useSubscription();

  const [roomInput, setRoomInput] = useState('');
  const [showRoomInput, setShowRoomInput] = useState(false);

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (roomInput.trim()) {
      onJoinRoom(roomInput.trim());
      setShowRoomInput(false);
    }
  };

  return (
    <header className="navbar-container glass-panel">
      {/* Left Brand & Sidebar Toggle */}
      <div className="navbar-left">
        <button className="icon-btn" onClick={onToggleSidebar} title="Toggle Sidebar">
          <Menu size={20} />
        </button>

        <div className="brand-wrap" onClick={onGoHome} title="Go to Home Feed">
          <div className="brand-logo-icon">
            <Sparkles size={20} className="text-cyan animate-pulse" />
          </div>
          <span className="brand-name">WeTube <span className="brand-tag">ULTIMATE</span></span>
        </div>
      </div>

      {/* Middle Search Bar */}
      <div className="navbar-center">
        <div className="search-box-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search 4K videos, shorts, exclusive channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="mic-btn" onClick={onOpenVoiceSearch} title="Voice Search">
            <Mic size={16} />
          </button>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="navbar-right">
        {/* Watch Party WebRTC Action */}
        <div className="rtc-party-wrap">
          {roomConnected ? (
            <div className="room-connected-badge" onClick={onOpenShare}>
              <Users size={16} className="text-purple-400 animate-pulse" />
              <span>Room: <strong>{roomId}</strong> ({peersCount} joined)</span>
            </div>
          ) : showRoomInput ? (
            <form onSubmit={handleJoinSubmit} className="mini-room-form">
              <input
                type="text"
                className="mini-input"
                placeholder="Room Code..."
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-cyan btn-sm">Join</button>
            </form>
          ) : (
            <button className="btn btn-primary btn-sm rtc-btn" onClick={() => setShowRoomInput(true)}>
              <Users size={16} />
              <span>Watch Party</span>
            </button>
          )}
        </div>

        {/* Creator Upload Button */}
        <button className="icon-btn" onClick={onOpenUpload} title="Upload Video">
          <Upload size={18} />
        </button>

        {/* Premium Subscription Tier Badge */}
        <button
          className={`tier-badge-btn tier-${subscription.plan.toLowerCase()}`}
          onClick={() => setIsPricingModalOpen(true)}
          title="Subscription Tier"
        >
          <Crown size={14} />
          <span>{subscription.plan}</span>
        </button>

        {/* User Security Profile Avatar */}
        <button className="profile-btn" onClick={() => setIsProfileModalOpen(true)} title="Security & Profile">
          <img src={user.avatar} alt={user.name} className="user-avatar-img" />
          <div className="status-dot-online" />
        </button>
      </div>

      <style>{`
        .navbar-container {
          height: 64px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          border-bottom: 1px solid var(--border-glass);
          border-radius: 0;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .brand-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .brand-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2));
          border: 1px solid var(--cyan);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-name {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, var(--cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .brand-tag {
          font-size: 0.65rem;
          font-weight: 800;
          background: var(--amber);
          color: black;
          padding: 2px 6px;
          border-radius: 4px;
          -webkit-text-fill-color: initial;
        }
        .navbar-center {
          flex: 1;
          max-width: 580px;
          margin: 0 20px;
        }
        .search-box-wrap {
          display: flex;
          align-items: center;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-full);
          padding: 6px 16px;
          transition: all 0.2s ease;
        }
        .search-box-wrap:focus-within {
          border-color: var(--cyan);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.25);
        }
        .search-icon {
          color: var(--text-muted);
          margin-right: 10px;
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-main);
          font-size: 0.88rem;
          outline: none;
        }
        .mic-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
        }
        .mic-btn:hover { color: var(--cyan); }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .rtc-party-wrap {
          display: flex;
          align-items: center;
        }
        .room-connected-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid var(--primary);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          cursor: pointer;
        }
        .mini-room-form {
          display: flex;
          gap: 6px;
        }
        .mini-input {
          width: 100px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 4px 8px;
          color: white;
          font-size: 0.78rem;
        }
        .tier-badge-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          border: 1px solid var(--border-glass);
        }
        .tier-free { background: rgba(100, 116, 139, 0.2); color: #cbd5e1; }
        .tier-bronze { background: rgba(217, 119, 6, 0.2); color: #f59e0b; border-color: #d97706; }
        .tier-silver { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-color: #38bdf8; }
        .tier-gold { background: linear-gradient(135deg, #eab308 0%, #d97706 100%); color: black; border-color: #fef08a; }

        .profile-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
        }
        .user-avatar-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--cyan);
        }
        .status-dot-online {
          width: 10px;
          height: 10px;
          background: #10b981;
          border: 2px solid #0f172a;
          border-radius: 50%;
          position: absolute;
          bottom: 0;
          right: 0;
        }
        .icon-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-md);
        }
        .icon-btn:hover {
          color: white;
          background: rgba(255,255,255,0.08);
        }
      `}</style>
    </header>
  );
}
