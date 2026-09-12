import React from 'react';
import {
  Home, Zap, Tv, HardDrive, History, ThumbsUp, Clock,
  Users, Crown, Shield, Settings, Compass, Sparkles
} from 'lucide-react';

const ALL_CREATORS = [
  { id: 'c1', name: 'CodeCraft Studios', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', isLive: true },
  { id: 'c2', name: 'Tech pulse HD', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', isLive: false },
  { id: 'c3', name: 'Lo-Fi Odyssey', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', isLive: true },
  { id: 'c4', name: 'Curiosity Quantum', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', isLive: false },
  { id: 'c5', name: 'PixelCraft Design', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', isLive: false },
  { id: 'c6', name: 'AI Frontier Labs', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', isLive: true },
  { id: 'c7', name: 'Alex Rivera (Creator)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', isLive: false },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  onOpenPricing,
  onOpenProfile,
  onSelectChannel,
  subscribedChannels = {},
}) {
  const mainNavItems = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'watch-party', label: 'Live Watch Party', icon: Users, badge: 'RTC' },
    { id: 'shorts', label: 'Shorts Reel', icon: Zap, badge: 'NEW' },
    { id: 'downloads', label: 'My Downloads', icon: HardDrive },
    { id: 'library', label: 'Library & History', icon: History },
  ];

  const activeSubscriptions = ALL_CREATORS.filter((ch) => Boolean(subscribedChannels[ch.name]));

  return (
    <aside className={`sidebar-container glass-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-section">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title={item.label}
            >
              <Icon size={20} className={isActive ? 'text-cyan' : ''} />
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className={`nav-badge ${item.badge === 'RTC' ? 'badge-rtc' : 'badge-new'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!isCollapsed && (
        <>
          <hr className="nav-divider" />

          {/* Subscribed Channels List */}
          <div className="nav-section">
            <span className="section-header">SUBSCRIPTIONS ({activeSubscriptions.length})</span>
            {activeSubscriptions.length > 0 ? (
              activeSubscriptions.map((ch) => (
                <button
                  key={ch.id}
                  className="nav-btn sub-channel-btn"
                  onClick={() => {
                    if (onSelectChannel) onSelectChannel(ch.name);
                    setActiveTab('home');
                  }}
                  title={ch.name}
                >
                  <div className="avatar-wrapper">
                    <img src={ch.avatar} alt={ch.name} className="sub-avatar" />
                    {ch.isLive && <span className="live-dot-indicator" />}
                  </div>
                  <span className="nav-label sub-channel-name">{ch.name}</span>
                </button>
              ))
            ) : (
              <span className="empty-subs-hint">No subscribed channels yet</span>
            )}
          </div>


          <hr className="nav-divider" />

          {/* Premium Callout */}
          <div className="sidebar-promo-card">
            <Crown size={22} className="text-amber-400 animate-bounce" />
            <div>
              <strong>WeTube Premium</strong>
              <p>Ad-Free, 4K & Unlimited Downloads</p>
            </div>
            <button className="btn btn-cyan btn-sm promo-btn" onClick={onOpenPricing}>
              View Tiers
            </button>
          </div>

          <hr className="nav-divider" />

          <div className="nav-section">
            <span className="section-header">SECURITY & PROFILE</span>
            <button className="nav-btn" onClick={onOpenProfile}>
              <Shield size={18} className="text-emerald-400" />
              <span className="nav-label">Risk Profile & Logs</span>
            </button>
          </div>
        </>
      )}


      <style>{`
        .sidebar-container {
          width: 240px;
          height: calc(100vh - 64px);
          position: fixed;
          top: 64px;
          left: 0;
          z-index: 100;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          border-right: 1px solid var(--border-glass);
          border-radius: 0;
        }
        .sidebar-container.collapsed {
          width: 72px;
        }
        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .section-header {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--text-dim);
          letter-spacing: 0.05em;
          padding: 6px 12px;
        }
        .sub-channel-btn {
          padding: 6px 12px;
        }
        .avatar-wrapper {
          position: relative;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
        .sub-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }
        .live-dot-indicator {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 8px;
          height: 8px;
          background-color: var(--rose);
          border: 1.5px solid #0f172a;
          border-radius: 50%;
        }
        .sub-channel-name {
          font-size: 0.82rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          position: relative;
        }
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-main);
        }
        .nav-btn.active {
          background: rgba(6, 182, 212, 0.15);
          color: var(--cyan);
          border-left: 3px solid var(--cyan);
        }
        .nav-label {
          white-space: nowrap;
        }
        .nav-badge {
          margin-left: auto;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: var(--radius-full);
        }
        .badge-rtc { background: rgba(139, 92, 246, 0.3); color: #c084fc; }
        .badge-new { background: rgba(16, 185, 129, 0.3); color: #34d399; }

        .nav-divider {
          border: none;
          border-top: 1px solid var(--border-glass);
          margin: 4px 0;
        }
        .sidebar-promo-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--amber);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
          font-size: 0.8rem;
        }
        .promo-btn {
          width: 100%;
        }
      `}</style>
    </aside>
  );
}
