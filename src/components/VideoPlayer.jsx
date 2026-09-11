import React, { useRef, useState, useEffect } from 'react';
import {
    Play, Pause, Volume2, VolumeX, Maximize, RotateCcw,
    Film, Link as LinkIcon, Upload, Check, RefreshCw, AlertCircle, Tv
} from 'lucide-react';

const SAMPLE_VIDEOS = [
    {
        title: 'Big Buck Bunny (Animation HD)',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        duration: '09:56'
    },
    {
        title: 'Elephant Dream (Sci-Fi Short)',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
        duration: '10:53'
    },
    {
        title: 'For Bigger Blazes (Action HD)',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
        duration: '00:15'
    },
    {
        title: 'Tears of Steel (VFX Short)',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
        duration: '12:14'
    }
];

export default function VideoPlayer({
    isHost,
    syncAction,
    onSendVideoAction,
    onHostStateRequest,
    hostInfo
}) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);

    const [currentVideo, setCurrentVideo] = useState(SAMPLE_VIDEOS[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isSynced, setIsSynced] = useState(true);
    const [showLibrary, setShowLibrary] = useState(false);
    const [customUrlInput, setCustomUrlInput] = useState('');
    const [syncNotice, setSyncNotice] = useState('');
    const [isYouTube, setIsYouTube] = useState(false);
    const [youtubeId, setYoutubeId] = useState('');

    // Extract YouTube ID if applicable
    const parseYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Helper to load video source
    const loadVideoSource = (srcObj, isBroadcasting = true) => {
        const ytId = parseYouTubeId(srcObj.url);
        if (ytId) {
            setIsYouTube(true);
            setYoutubeId(ytId);
        } else {
            setIsYouTube(false);
            setYoutubeId('');
        }

        setCurrentVideo(srcObj);
        setCurrentTime(0);

        if (isHost && isBroadcasting) {
            onSendVideoAction({
                type: 'CHANGE_SOURCE',
                video: srcObj,
                currentTime: 0,
                isPlaying: false
            });
        }
    };

    // Handle incoming remote sync action from Host
    useEffect(() => {
        if (!syncAction) return;

        if (syncAction.type === 'CHANGE_SOURCE') {
            loadVideoSource(syncAction.video, false);
            setSyncNotice(`Host changed video: ${syncAction.video.title}`);
            setTimeout(() => setSyncNotice(''), 4000);
            return;
        }

        const videoEl = videoRef.current;
        if (!videoEl && !isYouTube) return;

        if (syncAction.type === 'PLAY') {
            setIsPlaying(true);
            if (videoEl) {
                if (Math.abs(videoEl.currentTime - syncAction.currentTime) > 1.2) {
                    videoEl.currentTime = syncAction.currentTime;
                }
                videoEl.play().catch(e => console.warn('Play error:', e));
            }
            setSyncNotice(`Synced: Host played video`);
        } else if (syncAction.type === 'PAUSE') {
            setIsPlaying(false);
            if (videoEl) {
                videoEl.currentTime = syncAction.currentTime;
                videoEl.pause();
            }
            setSyncNotice(`Synced: Host paused video`);
        } else if (syncAction.type === 'SEEK') {
            setCurrentTime(syncAction.currentTime);
            if (videoEl) {
                videoEl.currentTime = syncAction.currentTime;
            }
            setSyncNotice(`Synced seek to ${formatTime(syncAction.currentTime)}`);
        }

        setIsSynced(true);
        setTimeout(() => setSyncNotice(''), 3000);
    }, [syncAction]);

    // Periodic drift check for participants
    useEffect(() => {
        if (isHost || !syncAction || isYouTube) return;
        const interval = setInterval(() => {
            const videoEl = videoRef.current;
            if (videoEl && syncAction.currentTime !== undefined && isPlaying) {
                const drift = Math.abs(videoEl.currentTime - syncAction.currentTime);
                if (drift > 2.0) {
                    videoEl.currentTime = syncAction.currentTime;
                    setIsSynced(false);
                    setSyncNotice(`Auto-resynced to Host timestamp`);
                    setTimeout(() => { setIsSynced(true); setSyncNotice(''); }, 2500);
                }
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [isHost, syncAction, isPlaying, isYouTube]);

    // Video playback state handlers
    const togglePlay = () => {
        if (!isHost) {
            setSyncNotice('Only Host can control video playback!');
            setTimeout(() => setSyncNotice(''), 3000);
            return;
        }

        const videoEl = videoRef.current;
        const nextState = !isPlaying;
        setIsPlaying(nextState);

        if (videoEl) {
            if (nextState) videoEl.play();
            else videoEl.pause();

            onSendVideoAction({
                type: nextState ? 'PLAY' : 'PAUSE',
                currentTime: videoEl.currentTime
            });
        } else {
            // YouTube embed mock toggle
            onSendVideoAction({
                type: nextState ? 'PLAY' : 'PAUSE',
                currentTime
            });
        }
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);

        if (!isHost) {
            setSyncNotice('Only Host can seek timestamp!');
            setTimeout(() => setSyncNotice(''), 3000);
            return;
        }

        const videoEl = videoRef.current;
        if (videoEl) {
            videoEl.currentTime = newTime;
        }

        onSendVideoAction({
            type: 'SEEK',
            currentTime: newTime
        });
    };

    const handleCustomUrlSubmit = (e) => {
        e.preventDefault();
        if (!customUrlInput.trim()) return;
        const newVideo = {
            title: 'Custom URL Stream',
            url: customUrlInput.trim(),
            duration: '--:--'
        };
        loadVideoSource(newVideo, true);
        setCustomUrlInput('');
        setShowLibrary(false);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileUrl = URL.createObjectURL(file);
        const newVideo = {
            title: `Local File: ${file.name}`,
            url: fileUrl,
            duration: 'Local'
        };
        loadVideoSource(newVideo, true);
        setShowLibrary(false);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => console.warn(err));
        } else {
            document.exitFullscreen().catch(err => console.warn(err));
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="player-outer-container" ref={containerRef}>
            {/* Notice Banner */}
            {syncNotice && (
                <div className="sync-notice-banner">
                    <AlertCircle size={15} />
                    <span>{syncNotice}</span>
                </div>
            )}

            {/* Main Video Viewport */}
            <div className="video-viewport">
                {isYouTube ? (
                    <iframe
                        className="youtube-iframe"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
                        title="YouTube Player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={currentVideo.url}
                        className="main-video-element"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onClick={togglePlay}
                        playsInline
                    />
                )}

                {/* Video Overlay Info Header */}
                <div className="video-header-overlay">
                    <div className="video-title-box">
                        <Film size={16} className="text-cyan" />
                        <span className="video-title-text">{currentVideo.title}</span>
                    </div>

                    <div className="player-header-actions">
                        {isHost && (
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setShowLibrary(!showLibrary)}
                            >
                                <Film size={14} />
                                <span>Video Library</span>
                            </button>
                        )}

                        {!isHost && (
                            <button
                                className={`btn btn-sm ${isSynced ? 'btn-secondary' : 'btn-cyan'}`}
                                onClick={onHostStateRequest}
                            >
                                <RefreshCw size={14} className={!isSynced ? 'animate-spin' : ''} />
                                <span>{isSynced ? 'Synced with Host' : 'Resync Now'}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Video Player Controls Bar */}
                {!isYouTube && (
                    <div className="controls-overlay-bar">
                        {/* Progress Slider */}
                        <div className="progress-container">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeek}
                                className="progress-slider"
                                disabled={!isHost}
                            />
                        </div>

                        <div className="controls-row">
                            <div className="controls-left">
                                <button className="control-icon-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                </button>

                                <div className="time-display">
                                    <span>{formatTime(currentTime)}</span>
                                    <span className="time-divider">/</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            <div className="controls-right">
                                <div className="volume-box">
                                    <button
                                        className="control-icon-btn"
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
                                            setIsMuted(val === 0);
                                            if (videoRef.current) {
                                                videoRef.current.volume = val;
                                                videoRef.current.muted = (val === 0);
                                            }
                                        }}
                                        className="volume-slider"
                                    />
                                </div>

                                <button className="control-icon-btn" onClick={toggleFullscreen} title="Fullscreen">
                                    <Maximize size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Video Source Selector Drawer */}
            {showLibrary && (
                <div className="library-modal-drawer">
                    <div className="library-header">
                        <h3>Select Video Source</h3>
                        <button className="close-btn" onClick={() => setShowLibrary(false)}>✕</button>
                    </div>

                    <div className="library-tabs">
                        {/* Custom URL Input */}
                        <form onSubmit={handleCustomUrlSubmit} className="url-form">
                            <div className="url-input-wrap">
                                <LinkIcon size={16} className="text-muted" />
                                <input
                                    type="url"
                                    placeholder="Paste direct MP4 or YouTube video URL..."
                                    className="input-field"
                                    value={customUrlInput}
                                    onChange={(e) => setCustomUrlInput(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-cyan">Play URL</button>
                        </form>

                        {/* Local Video File Upload */}
                        <div className="file-upload-box" onClick={() => fileInputRef.current?.click()}>
                            <Upload size={20} className="text-cyan" />
                            <span>Select local video file from your computer</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="video/*"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div className="sample-section">
                        <span className="sample-label">Sample Movie Trailers & Videos</span>
                        <div className="sample-grid">
                            {SAMPLE_VIDEOS.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`sample-card ${currentVideo.url === item.url ? 'active' : ''}`}
                                    onClick={() => {
                                        loadVideoSource(item, true);
                                        setShowLibrary(false);
                                    }}
                                >
                                    <img src={item.thumbnail} alt={item.title} className="sample-thumb" />
                                    <div className="sample-info">
                                        <span className="sample-title">{item.title}</span>
                                        <span className="sample-dur">{item.duration}</span>
                                    </div>
                                    {currentVideo.url === item.url && <Check size={16} className="active-check" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .player-outer-container {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #000;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), var(--shadow-glow);
          border: 1px solid var(--border-glass);
        }
        .sync-notice-banner {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid var(--primary);
          color: var(--text-main);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          animation: slideDown 0.25s ease-out;
        }
        .video-viewport {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .main-video-element, .youtube-iframe {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border: none;
        }
        .video-header-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 16px;
          background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
          pointer-events: auto;
        }
        .video-title-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.7);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-glass);
          font-size: 0.88rem;
          font-weight: 600;
        }
        .controls-overlay-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 14px 20px;
          background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .progress-container {
          width: 100%;
        }
        .progress-slider {
          width: 100%;
          accent-color: var(--cyan);
          height: 5px;
          cursor: pointer;
        }
        .controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .controls-left, .controls-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .control-icon-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
          transition: all 0.2s ease;
        }
        .control-icon-btn:hover {
          opacity: 1;
          transform: scale(1.1);
          color: var(--cyan);
        }
        .time-display {
          font-family: monospace;
          font-size: 0.85rem;
          color: var(--text-muted);
          display: flex;
          gap: 4px;
        }
        .volume-box {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .volume-slider {
          width: 65px;
          accent-color: var(--primary);
        }
        .library-modal-drawer {
          position: absolute;
          inset: 0;
          z-index: 30;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .library-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
        }
        .url-form {
          display: flex;
          gap: 10px;
        }
        .url-input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 0 12px;
        }
        .url-input-wrap input {
          border: none;
          background: transparent;
          box-shadow: none;
        }
        .file-upload-box {
          margin-top: 10px;
          border: 2px dashed var(--border-glass);
          border-radius: var(--radius-md);
          padding: 14px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .file-upload-box:hover {
          border-color: var(--cyan);
          color: var(--text-main);
        }
        .sample-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 700;
          display: block;
          margin-bottom: 10px;
        }
        .sample-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        .sample-card {
          position: relative;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sample-card:hover, .sample-card.active {
          border-color: var(--cyan);
          transform: translateY(-2px);
        }
        .sample-thumb {
          width: 100%;
          height: 90px;
          object-fit: cover;
        }
        .sample-info {
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
        }
        .sample-title {
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sample-dur {
          font-size: 0.72rem;
          color: var(--text-dim);
        }
        .active-check {
          position: absolute;
          top: 6px;
          right: 6px;
          background: var(--cyan);
          color: white;
          border-radius: 50%;
          padding: 2px;
        }
      `}</style>
        </div>
    );
}
