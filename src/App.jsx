import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { DownloadProvider, useDownload } from './context/DownloadContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CategoryBar from './components/CategoryBar';
import CustomVideoPlayer from './components/CustomVideoPlayer';
import CommentsSection from './components/CommentsSection';

// Layout & View Components
import ShortsPlayer from './components/ShortsPlayer';
import LibraryView from './components/LibraryView';

// Modals & Floating Tools
import NotificationToast from './components/NotificationToast';
import AuthModal from './components/AuthModal';
import OtpVerificationModal from './components/OtpVerificationModal';
import ProfileModal from './components/ProfileModal';
import DemoController from './components/DemoController';
import PricingModal from './components/PricingModal';
import RazorpayCheckoutModal from './components/RazorpayCheckoutModal';
import InvoiceModal from './components/InvoiceModal';
import DownloadModal from './components/DownloadModal';
import UploadModal from './components/UploadModal';
import ShareModal from './components/ShareModal';
import VoiceSearchModal from './components/VoiceSearchModal';

// Mock catalog data & RTC Service
import { FEATURED_VIDEOS } from './data/videoData';
import rtcService from './services/rtcService';

import {
  Users, MessageSquare, Mic, MicOff, Video, VideoOff, PhoneOff,
  Crown, Download, Share2, Sparkles, CheckCircle2, Play
} from 'lucide-react';

function MainAppContent() {
  const { user, addToast } = useAuth();
  const { isPricingModalOpen, setIsPricingModalOpen } = useSubscription();

  // Navigation & View state
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'shorts' | 'downloads' | 'library' | 'watch-party'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribedChannels, setSubscribedChannels] = useState({});

  const handleToggleChannelSubscribe = (channelName) => {
    setSubscribedChannels((prev) => {
      const isSub = !prev[channelName];
      if (isSub) {
        addToast({
          title: 'Subscribed!',
          message: `You are now subscribed to ${channelName}.`,
          type: 'success',
        });
      } else {
        addToast({
          title: 'Unsubscribed',
          message: `You unsubscribed from ${channelName}.`,
          type: 'info',
        });
      }
      return { ...prev, [channelName]: isSub };
    });
  };



  // Video State
  const [videoList, setVideoList] = useState(FEATURED_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    window.onResetSelectedVideo = () => setSelectedVideo(null);
  }, []);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);

  // WebRTC Watch Party State
  const [roomId, setRoomId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [peers, setPeers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    // Check for room in URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    if (roomParam) {
      joinWatchParty(roomParam);
    }
  }, []);

  // WebRTC Handlers
  const joinWatchParty = async (targetRoomId) => {
    try {
      const stream = await rtcService.initialize(user.name);
      setLocalStream(stream);
      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream;
      }

      rtcService.on('peer-joined', (peerData) => {
        setPeers((prev) => [...prev, peerData]);
      });

      rtcService.on('chat-message', (msg) => {
        setChatMessages((prev) => [...prev, msg]);
      });

      const joinedId = await rtcService.joinRoom(targetRoomId);
      setRoomId(joinedId);
      setIsHost(false);
      if (!selectedVideo) setSelectedVideo(FEATURED_VIDEOS[0]);
      setActiveTab('watch-party');
    } catch (err) {
      console.error('Failed to join room', err);
    }
  };

  const createWatchParty = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      const stream = await rtcService.initialize(user.name);
      setLocalStream(stream);
      if (localVideoRef.current && stream) {
        localVideoRef.current.srcObject = stream;
      }
      setRoomId(newRoomId);
      setIsHost(true);
      if (!selectedVideo) setSelectedVideo(FEATURED_VIDEOS[0]);
      setActiveTab('watch-party');
    } catch (err) {
      console.error('Failed to create room', err);
    }
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: user.name,
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    if (roomId) rtcService.sendChatMessage(newMsg);
    setChatInput('');
  };

  const handleAddUploadedVideo = (newVideo) => {
    setVideoList((prev) => [newVideo, ...prev]);
    setSelectedVideo(newVideo);
  };

  // Filter video catalog
  const filteredVideos = videoList.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channelName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Gold Exclusives') return v.tierExclusive === 'Gold';
    if (selectedCategory === 'Watch Party Live') return true;
    if (selectedCategory === 'AI & Machine Learning') return v.category === 'AI' || v.tags?.includes('#ai');
    if (selectedCategory === 'React & Vite') return v.category === 'Coding' || v.tags?.includes('#react');
    if (selectedCategory === 'Music & Lofi') return v.category === 'Lo-Fi' || v.category === 'Music';
    if (selectedCategory === 'Cybersecurity') return v.category === 'Tech' || v.tags?.includes('#security');

    return v.category === selectedCategory || v.tierExclusive === selectedCategory;
  });

  return (
    <div className="app-layout-root">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onGoHome={() => {
          setSelectedVideo(null);
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onJoinRoom={joinWatchParty}
        roomConnected={Boolean(roomId)}
        roomId={roomId}
        peersCount={peers.length}
      />

      <div className="main-content-layout">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'home') setSelectedVideo(null);
            setActiveTab(tab);
          }}
          isCollapsed={isSidebarCollapsed}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onSelectChannel={(chName) => {
            setSearchQuery(chName);
            setSelectedVideo(null);
            setActiveTab('home');
          }}
          subscribedChannels={subscribedChannels}
        />


        {/* Dynamic View Body */}
        <main className={`view-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {activeTab === 'shorts' ? (
            <ShortsPlayer />
          ) : activeTab === 'library' || activeTab === 'downloads' ? (
            <LibraryView onSelectVideo={(v) => { setSelectedVideo(v); setActiveTab('home'); }} />
          ) : !selectedVideo ? (
            /* YouTube Home Feed Video Grid View (Default Page Interface) */
            <div className="home-videos-catalog-section" style={{ marginTop: 0 }}>
              <CategoryBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              <div className="video-cards-responsive-grid" style={{ marginTop: '20px' }}>
                {filteredVideos.map((item) => (
                  <div
                    key={item.id}
                    className="video-card-tile glass-panel"
                    onClick={() => {
                      setSelectedVideo(item);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="thumb-wrap">
                      <img src={item.thumbnail} alt={item.title} className="thumb-img" />
                      <span className="duration-tag">{item.duration}</span>
                      {item.tierExclusive !== 'Free' && (
                        <span className="tier-overlay-badge"><Crown size={12} /> {item.tierExclusive}</span>
                      )}
                    </div>

                    <div className="tile-details">
                      <img src={item.channelAvatar} alt={item.channelName} className="channel-avatar-sm" />
                      <div className="tile-meta">
                        <h4 className="video-tile-title">{item.title}</h4>
                        <span className="channel-tile-name">{item.channelName}</span>
                        <span className="tile-stats">{item.views} • {item.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Back to Feed Navigation Bar */}
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedVideo(null)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  ← Back to Home Feed
                </button>
              </div>

              {/* Main Feed & Video Player View */}
              <div className="video-player-feed-layout">
                {/* Left Column: Player & Metadata & Comments */}
                <div className="player-column">
                  <CustomVideoPlayer
                    video={selectedVideo}
                    onSyncPlay={(time) => rtcService.sendSyncAction('play', time)}
                    onSyncPause={(time) => rtcService.sendSyncAction('pause', time)}
                    onSyncSeek={(time) => rtcService.sendSyncAction('seek', time)}
                    isHost={isHost}
                    roomConnected={Boolean(roomId)}
                  />

                  {/* Video Info Card */}
                  <div className="video-info-card glass-panel">
                    <h1 className="video-main-title">{selectedVideo.title}</h1>

                    <div className="video-metadata-bar">
                      <div className="channel-author-row">
                        <img src={selectedVideo.channelAvatar} alt={selectedVideo.channelName} className="channel-avatar" />
                        <div>
                          <strong className="channel-name">{selectedVideo.channelName}</strong>
                          <span className="sub-count">1.4M Subscribers</span>
                        </div>
                        <button
                          className={`btn btn-sm sub-btn ${subscribedChannels[selectedVideo.channelName] ? 'btn-secondary' : 'btn-cyan'}`}
                          onClick={() => handleToggleChannelSubscribe(selectedVideo.channelName)}
                        >
                          {subscribedChannels[selectedVideo.channelName] ? (
                            <>
                              <CheckCircle2 size={14} className="text-emerald-400" /> Subscribed
                            </>
                          ) : (
                            'Subscribe'
                          )}
                        </button>
                      </div>

                      <div className="action-buttons-group">
                        <button className="btn btn-amber btn-sm" onClick={() => setIsPricingModalOpen(true)}>
                          <Crown size={14} /> Upgrade Plan
                        </button>

                        <button className="btn btn-secondary btn-sm" onClick={() => setIsShareOpen(true)}>
                          <Share2 size={16} /> Share
                        </button>

                        {selectedVideo.tierExclusive !== 'Free' && (
                          <span className="tier-badge-pill">
                            <Crown size={14} className="text-amber-400" /> {selectedVideo.tierExclusive} Tier
                          </span>
                        )}
                      </div>
                    </div>


                    <p className="video-desc-text">{selectedVideo.description}</p>
                  </div>

                  {/* Multilingual Comment System */}
                  <CommentsSection />
                </div>

                {/* Right Column: WebRTC Watch Party Panel & Recommendations Catalog */}
                <div className="sidebar-feed-column">
                  {/* Watch Party WebRTC Card */}
                  <div className="rtc-party-card glass-panel">
                    <div className="rtc-card-header">
                      <div className="party-title-badge">
                        <Users size={18} className="text-purple-400" />
                        <h3>Real-Time Watch Party</h3>
                      </div>

                      {!roomId ? (
                        <button className="btn btn-primary btn-sm" onClick={createWatchParty}>
                          Create Room
                        </button>
                      ) : (
                        <span className="room-active-code">Room: {roomId}</span>
                      )}
                    </div>

                    {roomId && (
                      <div className="rtc-party-body">
                        {/* Video Call Grid */}
                        <div className="peers-video-grid">
                          <div className="peer-cam-box">
                            <video ref={localVideoRef} autoPlay muted className="cam-feed" />
                            <span className="cam-label">You ({user.name})</span>
                          </div>
                          {peers.map((p, idx) => (
                            <div key={idx} className="peer-cam-box">
                              <span className="cam-label">{p.name}</span>
                            </div>
                          ))}
                        </div>

                        {/* Chat box */}
                        <div className="party-chat-box">
                          <div className="chat-messages-scroll">
                            {chatMessages.map((msg, idx) => (
                              <div key={idx} className="chat-msg-row">
                                <strong>{msg.sender}:</strong> <span>{msg.text}</span>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={sendChatMessage} className="chat-form">
                            <input
                              type="text"
                              className="chat-input-field"
                              placeholder="Chat with room..."
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                            />
                            <button type="submit" className="btn btn-cyan btn-sm">Send</button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Category Horizontal Filter Tags */}
                  <CategoryBar
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />

                  {/* Video Catalog Grid */}
                  <div className="catalog-feed-list">
                    {filteredVideos.map((item) => (
                      <div
                        key={item.id}
                        className={`video-card-item ${selectedVideo.id === item.id ? 'active' : ''}`}
                        onClick={() => setSelectedVideo(item)}
                      >
                        <div className="thumb-container">
                          <img src={item.thumbnail} alt={item.title} className="video-thumb-img" />
                          <span className="duration-tag">{item.duration}</span>
                          {item.tierExclusive !== 'Free' && (
                            <span className="tier-overlay-badge"><Crown size={12} /> {item.tierExclusive}</span>
                          )}
                        </div>

                        <div className="card-details-info">
                          <h4 className="card-video-title">{item.title}</h4>
                          <span className="card-channel">{item.channelName}</span>
                          <span className="card-views">{item.views} • {item.uploadedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Home Feed Multi-Video Responsive Grid */}
              <div className="home-videos-catalog-section">
                <div className="catalog-section-header">
                  <div className="title-wrap">
                    <Sparkles size={20} className="text-cyan animate-pulse" />
                    <h3>Explore All Creator Videos ({filteredVideos.length})</h3>
                  </div>
                  <CategoryBar
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </div>

                <div className="video-cards-responsive-grid">
                  {filteredVideos.map((item) => (
                    <div
                      key={item.id}
                      className={`video-card-tile glass-panel ${selectedVideo.id === item.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedVideo(item);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="thumb-wrap">
                        <img src={item.thumbnail} alt={item.title} className="thumb-img" />
                        <span className="duration-tag">{item.duration}</span>
                        {item.tierExclusive !== 'Free' && (
                          <span className="tier-overlay-badge"><Crown size={12} /> {item.tierExclusive}</span>
                        )}
                      </div>

                      <div className="tile-details">
                        <img src={item.channelAvatar} alt={item.channelName} className="channel-avatar-sm" />
                        <div className="tile-meta">
                          <h4 className="video-tile-title">{item.title}</h4>
                          <span className="channel-tile-name">{item.channelName}</span>
                          <span className="tile-stats">{item.views} • {item.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {/* Global Modals & Notifications */}
      < NotificationToast />
      <AuthModal />
      <OtpVerificationModal />
      <ProfileModal />
      <DemoController />
      <PricingModal />
      <RazorpayCheckoutModal />
      <InvoiceModal />
      <DownloadModal />
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddVideo={handleAddUploadedVideo}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        roomId={roomId}
        videoTitle={selectedVideo ? selectedVideo.title : 'WeTube Video'}
      />
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearch={(q) => setSearchQuery(q)}
      />

      <style>{`
        .app-layout-root {
          min-height: 100vh;
          background: var(--bg-gradient);
          color: var(--text-main);
        }
        .main-content-layout {
          display: flex;
          padding-top: 64px;
        }
        .view-container {
          flex: 1;
          margin-left: 240px;
          padding: 20px;
          transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .view-container.sidebar-collapsed {
          margin-left: 72px;
        }
        .video-player-feed-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
        }
        @media (max-width: 1100px) {
          .video-player-feed-layout {
            grid-template-columns: 1fr;
          }
        }
        .player-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .video-info-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .video-main-title {
          font-size: 1.35rem;
          font-weight: 800;
          line-height: 1.3;
        }
        .video-metadata-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
        }
        .channel-author-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .channel-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }
        .channel-name {
          font-size: 0.95rem;
          display: block;
        }
        .sub-count {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tier-badge-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid var(--amber);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--amber);
        }
        .video-desc-text {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.45;
        }

        .sidebar-feed-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .rtc-party-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .rtc-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .party-title-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .party-title-badge h3 {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .room-active-code {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--cyan);
        }
        .peers-video-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }
        .peer-cam-box {
          position: relative;
          aspect-ratio: 16 / 9;
          background: black;
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .cam-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cam-label {
          position: absolute;
          bottom: 4px;
          left: 4px;
          font-size: 0.68rem;
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .party-chat-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: rgba(15, 23, 42, 0.6);
          border-radius: var(--radius-md);
          padding: 10px;
        }
        .chat-messages-scroll {
          max-height: 140px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.78rem;
        }
        .chat-msg-row strong {
          color: var(--cyan);
        }
        .chat-form {
          display: flex;
          gap: 6px;
        }
        .chat-input-field {
          flex: 1;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-sm);
          padding: 4px 8px;
          color: white;
          font-size: 0.78rem;
        }

        .catalog-feed-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .video-card-item {
          display: flex;
          gap: 12px;
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }
        .video-card-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .video-card-item.active {
          background: rgba(255, 42, 85, 0.15);
          border: 1px solid var(--cyan);
        }

        .home-videos-catalog-section {
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .catalog-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 16px;
        }
        .catalog-section-header .title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .catalog-section-header h3 {
          font-size: 1.25rem;
          font-weight: 800;
        }
        .video-cards-responsive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .video-card-tile {
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border-glass);
        }
        .video-card-tile:hover {
          transform: translateY(-5px);
          border-color: var(--cyan);
          box-shadow: 0 12px 28px rgba(255, 42, 85, 0.2);
        }
        .thumb-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: black;
          overflow: hidden;
        }
        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .video-card-tile:hover .thumb-img {
          transform: scale(1.04);
        }
        .tile-details {
          padding: 14px;
          display: flex;
          gap: 12px;
        }
        .channel-avatar-sm {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .tile-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }
        .video-tile-title {
          font-size: 0.92rem;
          font-weight: 700;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .channel-tile-name {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .tile-stats {
          font-size: 0.74rem;
          color: var(--text-dim);
        }
        .thumb-container {
          position: relative;
          width: 140px;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }
        .video-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .duration-tag {
          position: absolute;
          bottom: 4px;
          right: 4px;
          background: rgba(0,0,0,0.8);
          color: white;
          font-size: 0.7rem;
          font-family: monospace;
          padding: 2px 4px;
          border-radius: 4px;
        }
        .tier-overlay-badge {
          position: absolute;
          top: 4px;
          left: 4px;
          background: rgba(245, 158, 11, 0.9);
          color: black;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .card-details-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }
        .card-video-title {
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-channel {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .card-views {
          font-size: 0.72rem;
          color: var(--text-dim);
        }
      `}</style>
    </div >
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <DownloadProvider>
          <MainAppContent />
        </DownloadProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
