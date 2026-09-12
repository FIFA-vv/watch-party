import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceSearchModal({ isOpen, onClose, onSearch }) {
    const [transcript, setTranscript] = useState('Listening... Say something like "React tutorials"');
    const [isListening, setIsListening] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        setIsListening(true);

        const phrases = ['React 19 masterclass', 'Gold VIP movies', 'Realtime WebRTC watch party', 'AI neural networks'];
        const timer = setTimeout(() => {
            const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
            setTranscript(randomPhrase);
            setIsListening(false);

            setTimeout(() => {
                onSearch(randomPhrase);
                onClose();
            }, 1200);
        }, 2000);

        return () => clearTimeout(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content voice-modal-box">
                <div className="voice-mic-badge">
                    <Mic size={36} className={`mic-icon ${isListening ? 'listening' : ''}`} />
                </div>

                <h3>{isListening ? 'Listening...' : 'Search Query Detected'}</h3>
                <p className="transcript-text">"{transcript}"</p>

                <button className="btn btn-secondary btn-sm" onClick={onClose}>
                    Cancel
                </button>
            </div>

            <style>{`
        .voice-modal-box {
          max-width: 360px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .voice-mic-badge {
          width: 70px;
          height: 70px;
          background: rgba(6, 182, 212, 0.15);
          border: 2px solid var(--cyan);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .mic-icon.listening {
          color: var(--cyan);
          animation: pulse 1.2s infinite alternate;
        }
        .transcript-text {
          font-size: 0.95rem;
          color: var(--text-main);
          font-style: italic;
        }
      `}</style>
        </div>
    );
}
