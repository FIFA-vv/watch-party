import React, { useState, useRef, useEffect } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { useDownload } from '../context/DownloadContext';
import AdBannerOverlay from './AdBannerOverlay';
import {
    Play, Pause, Volume2, VolumeX, Maximize, Minimize,
    RotateCcw, RotateCw, Settings, Crown, Download, Share2,
    Tv, Sparkles, MessageSquare, ThumbsUp, CheckCircle, ShieldAlert
} from 'lucide-react';

export default function CustomVideoPlayer({
    video,
    onSyncPlay,
    onSyncPause,
    onSyncSeek,
    onSyncVideoChange,
    isHost,
    roomConnected,
    upNextVideo,
}) {
    const { canWatchVideo, setIsPricingModalOpen } = useSubscription();
    const { openDownloadModal } = useDownload();

    const videoRef = useRef(null);
    const containerRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [selectedQuality, setSelectedQuality] = useState('1080p');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    // Gesture animation states
    const [seekAnimation, setSeekAnimation] = useState(null); // 'left' or 'right'

    // Access check
    const accessCheck = canWatchVideo(video.tierExclusive || 'Free');

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackSpeed;
        }
    }, [playbackSpeed]);

    useEffect(() => {
        // Reset video state when video changes
        setIsPlaying(false);
        setCurrentTime(0);
    }, [video.id]);

    const togglePlay = () => {
        if (!accessCheck.allowed) {
            setIsPricingModalOpen(true);
            return;
        }

        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
                if (roomConnected && onSyncPause) onSyncPause(videoRef.current.currentTime);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
                if (roomConnected && onSyncPlay) onSyncPlay(videoRef.current.currentTime);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration || 0);
        }
    };

    const handleSeekChange = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
        if (roomConnected && onSyncSeek) {
            onSyncSeek(newTime);
        }
    };

    const seekRelative = (seconds) => {
        if (!videoRef.current) return;
        const newTime = Math.min(Math.max(0, videoRef.current.currentTime + seconds), duration);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);

        setSeekAnimation(seconds < 0 ? 'rewind' : 'forward');
        setTimeout(() => setSeekAnimation(null), 800);

        if (roomConnected && onSyncSeek) onSyncSeek(newTime);
    };

    const handleDoubleTap = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width / 2) {
            seekRelative(-10);
        } else {
            seekRelative(10);
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (timeInSec) => {
        if (isNaN(timeInSec)) return '00:00';
        const mins = Math.floor(timeInSec / 60);
        const secs = Math.floor(timeInSec % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div
            ref={containerRef}
            className={`custom-player-wrapper ${isTheaterMode ? 'theater-mode' : ''}`}
        >
            {/* Video Canvas Box */}
            <div className="player-canvas-container" onDoubleClick={handleDoubleTap}>
                {/* Tier Lock Overlay */}
                {!accessCheck.allowed ? (
                    <div className="tier-lock-overlay">
                        <Crown size={48} className="text-amber-400 animate-bounce" />
                        <h3>{video.tierExclusive} Exclusive Content</h3>
                        <p>{accessCheck.reason}</p>
                        <button className="btn btn-primary" onClick={() => setIsPricingModalOpen(true)}>
                            Upgrade Plan Now
                        </button>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        src={video.videoUrl}
                        poster={video.thumbnail}
                        className="video-element"
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        onClick={togglePlay}
                    />
                )}

                {/* Double-tap Seek Animation Overlays */}
                {seekAnimation === 'rewind' && (
                    <div className="seek-anim-overlay left">
                        <RotateCcw size={40} className="animate-spin" />
                        <span>-10 Seconds</span>
                    </div>
                )}
                {seekAnimation === 'forward' && (
                    <div className="seek-anim-overlay right">
                        <RotateCw size={40} className="animate-spin" />
                        <span>+10 Seconds</span>
                    </div>
                )}

                {/* Ad Overlay for Free/Bronze Tiers */}
                <AdBannerOverlay isPlaying={isPlaying} />

                {/* Player Controls Bar */}
                {accessCheck.allowed && (
                    <div className="player-controls-bar">
                        {/* Progress Slider */}
                        <div className="progress-bar-wrap">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeekChange}
                                className="progress-slider"
                            />
                        </div>

                        <div className="controls-row">
                            <div className="left-controls">
                                <button className="control-btn" onClick={togglePlay}>
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                </button>

                                <button className="control-btn" onClick={() => seekRelative(-10)}>
                                    <RotateCcw size={18} />
                                </button>
                                <button className="control-btn" onClick={() => seekRelative(10)}>
                                    <RotateCw size={18} />
                                </button>

                                <div className="volume-group">
                                    <button
                                        className="control-btn"
                                        onClick={() => {
                                            setIsMuted(!isMuted);
                                            if (videoRef.current) videoRef.current.muted = !isMuted;
                                        }}
                                    >
                                        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={isMuted ? 0 : volume}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setVolume(val);
                                            if (videoRef.current) videoRef.current.volume = val;
                                            setIsMuted(val === 0);
                                        }}
                                        className="volume-slider"
                                    />
                                </div>

                                <span className="time-display">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>

                            <div className="right-controls">
                                <button
                                    className="control-btn"
                                    onClick={() => openDownloadModal(video)}
                                    title="Download Video File"
                                >
                                    <Download size={18} />
                                </button>

                                <button
                                    className="control-btn"
                                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                                    title="Toggle Theater Mode"
                                >
                                    <Tv size={18} className={isTheaterMode ? 'text-cyan' : ''} />
                                </button>

                                {/* Settings dropdown */}
                                <div className="settings-menu-wrap">
                                    <button
                                        className="control-btn"
                                        onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                                    >
                                        <Settings size={18} />
                                    </button>

                                    {showSettingsMenu && (
                                        <div className="settings-popover glass-panel">
                                            <div className="menu-group">
                                                <span className="menu-header">Playback Speed</span>
                                                {[0.5, 1, 1.25, 1.5, 2].map((spd) => (
                                                    <button
                                                        key={spd}
                                                        className={`menu-item ${playbackSpeed === spd ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setPlaybackSpeed(spd);
                                                            setShowSettingsMenu(false);
                                                        }}
                                                    >
                                                        {spd}x {spd === 1 ? '(Normal)' : ''}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="menu-group">
                                                <span className="menu-header">Video Quality</span>
                                                {['360p', '480p', '720p', '1080p', '4K'].map((q) => (
                                                    <button
                                                        key={q}
                                                        className={`menu-item ${selectedQuality === q ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setSelectedQuality(q);
                                                            setShowSettingsMenu(false);
                                                        }}
                                                    >
                                                        {q}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button className="control-btn" onClick={toggleFullscreen}>
                                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .custom-player-wrapper {
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: black;
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
          position: relative;
        }
        .player-canvas-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
          overflow: hidden;
        }
        .video-element {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
        }
        .tier-lock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 24px;
          text-align: center;
          z-index: 30;
        }
        .tier-lock-overlay h3 { font-size: 1.4rem; font-weight: 800; }
        .tier-lock-overlay p { font-size: 0.88rem; color: var(--text-muted); max-width: 420px; }

        .seek-anim-overlay {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.6);
          padding: 16px 24px;
          border-radius: var(--radius-lg);
          color: var(--cyan);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          pointer-events: none;
          animation: fadeIn 0.2s ease;
        }
        .seek-anim-overlay.left { left: 20%; }
        .seek-anim-overlay.right { right: 20%; }

        .player-controls-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%);
          padding: 8px 16px 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 50;
        }
        .progress-bar-wrap {
          width: 100%;
        }
        .progress-slider {
          width: 100%;
          accent-color: var(--cyan);
          cursor: pointer;
        }
        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .left-controls, .right-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .control-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .control-btn:hover { color: var(--cyan); }

        .volume-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .volume-slider {
          width: 60px;
          accent-color: var(--cyan);
        }
        .time-display {
          font-size: 0.78rem;
          font-family: monospace;
          color: var(--text-muted);
        }
        .settings-menu-wrap {
          position: relative;
        }
        .settings-popover {
          position: absolute;
          bottom: 34px;
          right: 0;
          width: 180px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: rgba(15, 23, 42, 0.95);
          z-index: 60;
        }
        .menu-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .menu-header {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .menu-item {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.78rem;
          padding: 4px 8px;
          text-align: left;
          cursor: pointer;
          border-radius: var(--radius-sm);
        }
        .menu-item.active {
          background: rgba(6, 182, 212, 0.2);
          color: var(--cyan);
          font-weight: 700;
        }
      `}</style>
        </div>
    );
}
