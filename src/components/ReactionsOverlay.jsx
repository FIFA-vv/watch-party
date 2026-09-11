import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function ReactionsOverlay({ reactionEvent }) {
    const [activeReactions, setActiveReactions] = useState([]);

    useEffect(() => {
        if (!reactionEvent) return;

        // Trigger celebratory confetti if reaction is party/heart/fire
        if (['🎉', '❤️', '🔥', '🍿'].includes(reactionEvent.emoji)) {
            confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.8 }
            });
        }

        const newReaction = {
            id: Math.random().toString(36).substring(2, 9),
            emoji: reactionEvent.emoji,
            senderName: reactionEvent.senderName,
            left: Math.floor(Math.random() * 70) + 15 // percentage from left
        };

        setActiveReactions(prev => [...prev, newReaction]);

        // Remove reaction item after animation completes (2.5 seconds)
        setTimeout(() => {
            setActiveReactions(prev => prev.filter(item => item.id !== newReaction.id));
        }, 2500);
    }, [reactionEvent]);

    return (
        <div className="reactions-overlay-layer">
            {activeReactions.map((item) => (
                <div
                    key={item.id}
                    className="floating-emoji-item"
                    style={{ left: `${item.left}%` }}
                >
                    <span className="emoji-char">{item.emoji}</span>
                    <span className="emoji-sender">{item.senderName}</span>
                </div>
            ))}

            <style>{`
        .reactions-overlay-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 99;
          overflow: hidden;
        }
        .floating-emoji-item {
          position: absolute;
          bottom: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: floatUp 2.5s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }
        .emoji-char {
          font-size: 2.8rem;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
        }
        .emoji-sender {
          background: rgba(15, 23, 42, 0.85);
          color: white;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
          border: 1px solid var(--border-glass);
          margin-top: -4px;
        }
        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.6);
          }
          15% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          80% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translateY(-250px) scale(1);
          }
        }
      `}</style>
        </div>
    );
}
