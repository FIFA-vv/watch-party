import React, { useRef, useEffect } from 'react';
import { MicOff, VideoOff, Crown, Hand, Monitor } from 'lucide-react';

export default function VideoGrid({
    localStream,
    localUserInfo,
    remoteStreams, // Map(peerId -> { stream, userInfo })
    screenStream,
    isHost
}) {
    const localVideoRef = useRef(null);
    const screenVideoRef = useRef(null);

    // Attach local stream
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Attach screen stream
    useEffect(() => {
        if (screenVideoRef.current && screenStream) {
            screenVideoRef.current.srcObject = screenStream;
        }
    }, [screenStream]);

    const remoteEntries = Array.from(remoteStreams.entries());

    return (
        <div className="video-grid-container">
            {/* Screen Share Tile (if active) */}
            {screenStream && (
                <div className="grid-tile screen-tile">
                    <video
                        ref={screenVideoRef}
                        autoPlay
                        playsInline
                        className="tile-video"
                    />
                    <div className="tile-badge">
                        <Monitor size={14} className="text-cyan" />
                        <span>Shared Screen</span>
                    </div>
                </div>
            )}

            {/* Local Video Tile */}
            <div className={`grid-tile ${localUserInfo.isHandRaised ? 'hand-raised' : ''}`}>
                {localStream && !localUserInfo.isCameraOff ? (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="tile-video mirrored"
                    />
                ) : (
                    <div className="tile-placeholder">
                        <span className="placeholder-avatar">{localUserInfo.avatar || '👤'}</span>
                    </div>
                )}

                {/* Overlay Badges */}
                <div className="tile-info-bar">
                    <span className="user-name">
                        {localUserInfo.name} (You)
                    </span>
                    <div className="status-icons">
                        {isHost && <Crown size={14} className="text-amber" title="Host" />}
                        {localUserInfo.isHandRaised && <Hand size={14} className="text-cyan animate-bounce" />}
                        {localUserInfo.isMuted && <MicOff size={14} className="text-rose" />}
                        {localUserInfo.isCameraOff && <VideoOff size={14} className="text-muted" />}
                    </div>
                </div>
            </div>

            {/* Remote Video Tiles */}
            {remoteEntries.map(([peerId, item]) => (
                <RemoteVideoTile
                    key={peerId}
                    peerId={peerId}
                    stream={item.stream}
                    userInfo={item.userInfo}
                />
            ))}

            <style>{`
        .video-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          width: 100%;
        }
        .grid-tile {
          position: relative;
          aspect-ratio: 16 / 10;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          transition: all 0.25s ease;
        }
        .grid-tile.hand-raised {
          border-color: var(--cyan);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
        }
        .grid-tile.screen-tile {
          grid-column: 1 / -1;
          aspect-ratio: 16 / 9;
        }
        .tile-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .tile-video.mirrored {
          transform: scaleX(-1);
        }
        .tile-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
        }
        .placeholder-avatar {
          font-size: 2.2rem;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
        }
        .tile-info-bar {
          position: absolute;
          bottom: 8px;
          left: 8px;
          right: 8px;
          padding: 4px 8px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .user-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
        }
        .status-icons {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tile-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(15, 23, 42, 0.85);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
        </div>
    );
}

// Subcomponent for Remote Stream Rendering
function RemoteVideoTile({ peerId, stream, userInfo }) {
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        if (remoteVideoRef.current && stream) {
            remoteVideoRef.current.srcObject = stream;
        }
    }, [stream]);

    const info = userInfo || { name: 'Guest', avatar: '🍿', isMuted: false, isCameraOff: false, isHost: false };

    return (
        <div className={`grid-tile ${info.isHandRaised ? 'hand-raised' : ''}`}>
            {stream && !info.isCameraOff ? (
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="tile-video"
                />
            ) : (
                <div className="tile-placeholder">
                    <span className="placeholder-avatar">{info.avatar || '🍿'}</span>
                </div>
            )}

            <div className="tile-info-bar">
                <span className="user-name">{info.name}</span>
                <div className="status-icons">
                    {info.isHost && <Crown size={14} className="text-amber" title="Host" />}
                    {info.isHandRaised && <Hand size={14} className="text-cyan animate-bounce" />}
                    {info.isMuted && <MicOff size={14} className="text-rose" />}
                    {info.isCameraOff && <VideoOff size={14} className="text-muted" />}
                </div>
            </div>
        </div>
    );
}
