import React, { useState, useEffect, useRef } from 'react';
import { Disc, Download, X, Play, Video, CheckCircle2 } from 'lucide-react';

export default function SessionRecorder({
    isRecording,
    onStopRecording,
    recordedBlob,
    onClearBlob
}) {
    const [timerSeconds, setTimerSeconds] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isRecording) {
            setTimerSeconds(0);
            interval = setInterval(() => {
                setTimerSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTimer = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleDownload = () => {
        if (!recordedBlob) return;
        const url = URL.createObjectURL(recordedBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `cinesync-party-recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    return (
        <>
            {/* Live Recording Floating Indicator */}
            {isRecording && (
                <div className="recording-live-pill">
                    <span className="rec-dot animate-pulse" />
                    <span className="rec-text">REC {formatTimer(timerSeconds)}</span>
                    <button className="rec-stop-btn" onClick={onStopRecording}>
                        Stop
                    </button>
                </div>
            )}

            {/* Recorded File Download Modal */}
            {recordedBlob && (
                <div className="modal-overlay">
                    <div className="modal-content download-card">
                        <button className="close-btn" onClick={onClearBlob}>
                            <X size={18} />
                        </button>

                        <div className="dl-icon-box">
                            <CheckCircle2 size={36} className="text-emerald" />
                        </div>

                        <h2>Recording Ready!</h2>
                        <p>Your watch party session recording has been processed and is ready to save locally.</p>

                        <div className="preview-wrap">
                            <video
                                src={URL.createObjectURL(recordedBlob)}
                                controls
                                className="recorded-video-preview"
                            />
                        </div>

                        <div className="dl-actions">
                            <button className="btn btn-secondary" onClick={onClearBlob}>
                                Discard
                            </button>
                            <button className="btn btn-primary" onClick={handleDownload}>
                                <Download size={18} />
                                <span>Download Video (.webm)</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .recording-live-pill {
          position: fixed;
          top: 80px;
          left: 24px;
          z-index: 95;
          background: rgba(244, 63, 94, 0.9);
          backdrop-filter: blur(10px);
          color: white;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          box-shadow: 0 4px 20px rgba(244, 63, 94, 0.5);
          animation: slideDown 0.3s ease;
        }
        .rec-dot {
          width: 10px;
          height: 10px;
          background: #fff;
          border-radius: 50%;
        }
        .rec-stop-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: white;
          padding: 2px 10px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          cursor: pointer;
        }
        .rec-stop-btn:hover {
          background: rgba(0, 0, 0, 0.6);
        }
        .download-card {
          max-width: 460px;
          text-align: center;
        }
        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .dl-icon-box {
          margin-bottom: 12px;
        }
        .download-card h2 {
          font-size: 1.4rem;
          margin-bottom: 6px;
        }
        .download-card p {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .preview-wrap {
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #000;
          margin-bottom: 20px;
          max-height: 220px;
        }
        .recorded-video-preview {
          width: 100%;
          max-height: 220px;
        }
        .dl-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
      `}</style>
        </>
    );
}
