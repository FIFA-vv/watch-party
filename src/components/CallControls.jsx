import React from 'react';
import {
    Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
    MessageSquare, Disc, Hand, LogOut, Heart, Sparkles, Smile
} from 'lucide-react';

export default function CallControls({
    isMuted,
    isCameraOff,
    isScreenSharing,
    isRecording,
    isHandRaised,
    unreadCount,
    onToggleMic,
    onToggleCamera,
    onToggleScreenShare,
    onToggleRecording,
    onToggleHand,
    onToggleChat,
    onLeaveCall,
    onTriggerReaction
}) {
    return (
        <div className="call-controls-wrapper">
            <div className="glass-panel controls-toolbar">
                {/* Mic Button */}
                <button
                    className={`ctrl-btn ${isMuted ? 'off' : 'active'}`}
                    onClick={onToggleMic}
                    title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    <span className="ctrl-label">{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                {/* Camera Button */}
                <button
                    className={`ctrl-btn ${isCameraOff ? 'off' : 'active'}`}
                    onClick={onToggleCamera}
                    title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                    {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
                    <span className="ctrl-label">{isCameraOff ? 'Cam Off' : 'Cam On'}</span>
                </button>

                {/* Screen Share Button */}
                <button
                    className={`ctrl-btn ${isScreenSharing ? 'accent-cyan' : ''}`}
                    onClick={onToggleScreenShare}
                    title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
                >
                    {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
                    <span className="ctrl-label">{isScreenSharing ? 'Sharing' : 'Share'}</span>
                </button>

                {/* Record Session Button */}
                <button
                    className={`ctrl-btn ${isRecording ? 'recording-pulse' : ''}`}
                    onClick={onToggleRecording}
                    title={isRecording ? 'Stop Recording' : 'Record Session'}
                >
                    <Disc size={20} className={isRecording ? 'text-rose' : ''} />
                    <span className="ctrl-label">{isRecording ? 'REC...' : 'Record'}</span>
                </button>

                {/* Quick Reactions Bar */}
                <div className="reaction-pop-bar">
                    {['❤️', '🔥', '🎉', '😂', '👏', '🍿'].map((emoji, i) => (
                        <button
                            key={i}
                            className="mini-emoji-btn"
                            onClick={() => onTriggerReaction(emoji)}
                            title={`React ${emoji}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                {/* Raise Hand Button */}
                <button
                    className={`ctrl-btn ${isHandRaised ? 'accent-cyan' : ''}`}
                    onClick={onToggleHand}
                    title="Raise Hand"
                >
                    <Hand size={20} />
                    <span className="ctrl-label">Raise</span>
                </button>

                {/* Chat Toggle Button */}
                <button
                    className="ctrl-btn relative-btn"
                    onClick={onToggleChat}
                    title="Toggle Chat"
                >
                    <MessageSquare size={20} />
                    {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                    <span className="ctrl-label">Chat</span>
                </button>

                <div className="divider-line" />

                {/* Leave Call Button */}
                <button
                    className="ctrl-btn leave-btn"
                    onClick={onLeaveCall}
                    title="Leave Watch Party"
                >
                    <LogOut size={20} />
                    <span className="ctrl-label">Leave</span>
                </button>
            </div>

            <style>{`
        .call-controls-wrapper {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 90;
        }
        .controls-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border-radius: var(--radius-full);
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-glass);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), var(--shadow-glow);
        }
        .ctrl-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          color: var(--text-main);
          width: 52px;
          height: 52px;
          border-radius: 50%;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ctrl-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          transform: translateY(-2px);
        }
        .ctrl-btn.off {
          background: rgba(244, 63, 94, 0.2);
          border-color: rgba(244, 63, 94, 0.4);
          color: var(--rose);
        }
        .ctrl-btn.accent-cyan {
          background: rgba(6, 182, 212, 0.25);
          border-color: var(--cyan);
          color: var(--cyan);
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
        }
        .ctrl-btn.recording-pulse {
          background: rgba(244, 63, 94, 0.3);
          border-color: var(--rose);
          box-shadow: 0 0 15px rgba(244, 63, 94, 0.6);
          animation: pulse-red 1.5s infinite;
        }
        .leave-btn {
          background: linear-gradient(135deg, var(--rose) 0%, #e11d48 100%);
          border-color: transparent;
          color: white;
        }
        .leave-btn:hover {
          box-shadow: 0 4px 15px rgba(244, 63, 94, 0.5);
        }
        .ctrl-label {
          display: none;
        }
        .reaction-pop-bar {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(30, 41, 59, 0.7);
          padding: 4px 8px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-glass);
        }
        .mini-emoji-btn {
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 3px;
          border-radius: 50%;
          transition: transform 0.15s ease;
        }
        .mini-emoji-btn:hover {
          transform: scale(1.35);
        }
        .divider-line {
          width: 1px;
          height: 30px;
          background: var(--border-glass);
          margin: 0 4px;
        }
        .relative-btn {
          position: relative;
        }
        .unread-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--rose);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .controls-toolbar {
            padding: 8px 12px;
            gap: 6px;
          }
          .ctrl-btn {
            width: 44px;
            height: 44px;
          }
          .reaction-pop-bar {
            display: none;
          }
        }
      `}</style>
        </div>
    );
}
