import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SHORTS_DATA } from '../data/videoData';

import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function ShortsPlayer() {
  const { addToast } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likesCount, setLikesCount] = useState(SHORTS_DATA[0].likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribeToggle = () => {
    const nextState = !isSubscribed;
    setIsSubscribed(nextState);
    addToast({
      title: nextState ? 'Subscribed!' : 'Unsubscribed',
      message: nextState ? `Subscribed to @${currentShort.channelName}` : `Unsubscribed from @${currentShort.channelName}`,
      type: nextState ? 'success' : 'info',
    });
  };


  const currentShort = SHORTS_DATA[currentIndex];

  const handleNext = () => {
    if (currentIndex < SHORTS_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasLiked(false);
      setLikesCount(SHORTS_DATA[currentIndex + 1].likes);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setHasLiked(false);
      setLikesCount(SHORTS_DATA[currentIndex - 1].likes);
    }
  };

  const toggleLike = () => {
    if (hasLiked) {
      setLikesCount(likesCount - 1);
      setHasLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="shorts-reel-container">
      <div className="shorts-card glass-panel">
        <video
          src={currentShort.videoUrl}
          poster={currentShort.poster}
          className="shorts-video"
          autoPlay
          loop
          muted={isMuted}
          onClick={() => setIsPlaying(!isPlaying)}
        />

        {/* Floating Controls Overlay */}
        <div className="shorts-overlay">
          <div className="shorts-top-bar">
            <button className="icon-btn-round" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          <div className="shorts-bottom-info">
            <div className="creator-row">
              <img src={currentShort.avatar} alt={currentShort.channelName} className="creator-avatar" />
              <span className="creator-handle">@{currentShort.channelName}</span>
              <button
                className={`subscribe-btn-sm ${isSubscribed ? 'subscribed' : ''}`}
                onClick={handleSubscribeToggle}
              >
                {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
              </button>

            </div>

            <p className="shorts-title">{currentShort.title}</p>
            <div className="audio-track">
              <Music size={14} className="animate-spin-slow" />
              <span>Original Audio - {currentShort.channelName}</span>
            </div>
          </div>

          {/* Action sidebar */}
          <div className="shorts-sidebar-actions">
            <button className={`action-btn-short ${hasLiked ? 'liked' : ''}`} onClick={toggleLike}>
              <ThumbsUp size={22} />
              <span>{likesCount}</span>
            </button>

            <button className="action-btn-short">
              <MessageSquare size={22} />
              <span>{currentShort.comments}</span>
            </button>

            <button className="action-btn-short">
              <Share2 size={22} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Up/Down Reel Navigation */}
        <div className="reel-nav-buttons">
          <button className="nav-reel-btn" onClick={handlePrev} disabled={currentIndex === 0}>
            ▲ Prev
          </button>
          <button className="nav-reel-btn" onClick={handleNext} disabled={currentIndex === SHORTS_DATA.length - 1}>
            ▼ Next
          </button>
        </div>
      </div>

      <style>{`
        .shorts-reel-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 0;
          height: calc(100vh - 120px);
        }
        .shorts-card {
          width: 380px;
          height: 100%;
          max-height: 680px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          background: black;
          box-shadow: 0 20px 40px rgba(0,0,0,0.8);
        }
        .shorts-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
        }
        .shorts-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
          pointer-events: none;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.8) 100%);
        }
        .shorts-top-bar {
          display: flex;
          justify-content: flex-end;
          pointer-events: auto;
        }
        .icon-btn-round {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .shorts-bottom-info {
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-right: 60px;
        }
        .creator-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .creator-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
        .creator-handle {
          font-weight: 700;
          font-size: 0.9rem;
          color: white;
        }
        .subscribe-btn-sm {
          background: var(--cyan);
          color: black;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: none;
          cursor: pointer;
        }
        .shorts-title {
          font-size: 0.9rem;
          color: white;
          line-height: 1.3;
        }
        .audio-track {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .shorts-sidebar-actions {
          position: absolute;
          right: 16px;
          bottom: 24px;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }
        .action-btn-short {
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50%;
          width: 46px;
          height: 46px;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.7rem;
        }
        .action-btn-short.liked {
          color: var(--cyan);
          border-color: var(--cyan);
        }
        .reel-nav-buttons {
          position: absolute;
          right: -80px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .nav-reel-btn {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid var(--border-glass);
          color: white;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
