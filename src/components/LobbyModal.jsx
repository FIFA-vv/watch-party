import React, { useState, useEffect } from 'react';
import { Play, Video, Mic, MicOff, VideoOff, Sparkles, Film, ArrowRight } from 'lucide-react';

const AVATARS = ['🍿', '🎬', '🚀', '🦊', '🎧', '⚡', '🎮', '🦄', '🍿', '🔥'];

export default function LobbyModal({ onJoinRoom, defaultRoomId }) {
    const [name, setName] = useState(localStorage.getItem('cinesync_username') || '');
    const [avatar, setAvatar] = useState(AVATARS[0]);
    const [roomIdInput, setRoomIdInput] = useState(defaultRoomId || '');
    const [isCreatingHost, setIsCreatingHost] = useState(!defaultRoomId);

    const [hasCamera, setHasCamera] = useState(true);
    const [hasMic, setHasMic] = useState(true);
    const [previewStream, setPreviewStream] = useState(null);

    useEffect(() => {
        // Generate random room code if creating host room
        if (!defaultRoomId && !roomIdInput) {
            const randomCode = 'party-' + Math.random().toString(36).substring(2, 8);
            setRoomIdInput(randomCode);
        }
    }, [defaultRoomId]);

    // Handle local camera preview
    useEffect(() => {
        let activeStream = null;
        async function startPreview() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                activeStream = stream;
                setPreviewStream(stream);
            } catch (err) {
                console.warn('Camera/Mic preview unavailable:', err.message);
                setHasCamera(false);
            }
        }
        startPreview();
        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        const finalRoomId = roomIdInput.trim() || 'party-' + Math.floor(Math.random() * 10000);
        localStorage.setItem('cinesync_username', name);

        onJoinRoom({
            roomId: finalRoomId,
            userInfo: {
                name,
                avatar,
                isMuted: !hasMic,
                isCameraOff: !hasCamera
            },
            isHost: isCreatingHost,
            stream: previewStream
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content lobby-card">
                <div className="lobby-header">
                    <div className="lobby-icon">
                        <Film size={28} />
                    </div>
                    <h2>Join Watch Party</h2>
                    <p className="lobby-subtitle">Watch videos in sync & video chat with friends in real time</p>
                </div>

                {/* Mode Selector */}
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${isCreatingHost ? 'active' : ''}`}
                        onClick={() => setIsCreatingHost(true)}
                        type="button"
                    >
                        <Sparkles size={16} />
                        Create Party
                    </button>
                    <button
                        className={`mode-btn ${!isCreatingHost ? 'active' : ''}`}
                        onClick={() => setIsCreatingHost(false)}
                        type="button"
                    >
                        Join Party
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="lobby-form">
                    {/* User Name Input */}
                    <div className="form-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="e.g. Alex"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={20}
                        />
                    </div>

                    {/* Avatar Selector */}
                    <div className="form-group">
                        <label>Choose Avatar</label>
                        <div className="avatar-grid">
                            {AVATARS.map((emoji, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`avatar-btn ${avatar === emoji ? 'selected' : ''}`}
                                    onClick={() => setAvatar(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Room ID Input */}
                    <div className="form-group">
                        <label>{isCreatingHost ? 'Party Room ID (Auto-generated)' : 'Enter Party Room Code'}</label>
                        <input
                            type="text"
                            className="input-field room-input"
                            placeholder="e.g. party-88231"
                            value={roomIdInput}
                            onChange={(e) => setRoomIdInput(e.target.value)}
                            required
                        />
                    </div>

                    {/* Camera/Mic Preview Box */}
                    <div className="preview-box">
                        {previewStream && hasCamera ? (
                            <video
                                autoPlay
                                playsInline
                                muted
                                ref={(el) => {
                                    if (el && previewStream) el.srcObject = previewStream;
                                }}
                                className="preview-video"
                            />
                        ) : (
                            <div className="preview-placeholder">
                                <span className="avatar-large">{avatar}</span>
                                <p>{hasCamera ? 'Initializing camera...' : 'Camera Off / Microphone Only'}</p>
                            </div>
                        )}

                        <div className="preview-controls">
                            <button
                                type="button"
                                className={`preview-toggle-btn ${!hasMic ? 'off' : ''}`}
                                onClick={() => setHasMic(!hasMic)}
                                title="Toggle Mic"
                            >
                                {hasMic ? <Mic size={16} /> : <MicOff size={16} />}
                            </button>
                            <button
                                type="button"
                                className={`preview-toggle-btn ${!hasCamera ? 'off' : ''}`}
                                onClick={() => setHasCamera(!hasCamera)}
                                title="Toggle Camera"
                            >
                                {hasCamera ? <Video size={16} /> : <VideoOff size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn">
                        <span>{isCreatingHost ? 'Start Watch Party' : 'Enter Party Room'}</span>
                        <ArrowRight size={18} />
                    </button>
                </form>
            </div>

            <style>{`
        .lobby-card {
          max-width: 460px;
        }
        .lobby-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .lobby-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--cyan) 100%);
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 12px;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
        }
        .lobby-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 4px;
        }
        .lobby-subtitle {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .mode-toggle {
          display: flex;
          background: rgba(30, 41, 59, 0.6);
          padding: 4px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          border: 1px solid var(--border-glass);
        }
        .mode-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.88rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mode-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 2px 10px rgba(139, 92, 246, 0.4);
        }
        .lobby-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }
        .form-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .avatar-grid {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .avatar-btn {
          width: 40px;
          height: 40px;
          font-size: 1.3rem;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border-glass);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .avatar-btn:hover, .avatar-btn.selected {
          border-color: var(--primary);
          background: rgba(139, 92, 246, 0.25);
          transform: scale(1.1);
        }
        .room-input {
          font-family: monospace;
          letter-spacing: 0.05em;
        }
        .preview-box {
          position: relative;
          height: 140px;
          background: rgba(15, 23, 42, 0.8);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-glass);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .preview-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
        .preview-placeholder {
          text-align: center;
          color: var(--text-dim);
          font-size: 0.85rem;
        }
        .avatar-large {
          font-size: 2.2rem;
          display: block;
          margin-bottom: 4px;
        }
        .preview-controls {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: flex;
          gap: 6px;
        }
        .preview-toggle-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .preview-toggle-btn.off {
          background: var(--rose);
          border-color: transparent;
        }
        .submit-btn {
          width: 100%;
          padding: 13px;
          font-size: 1rem;
          margin-top: 6px;
        }
      `}</style>
        </div>
    );
}
