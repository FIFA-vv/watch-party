import React from 'react';

const CATEGORIES = [
    'All',
    'Watch Party Live',
    'Gold Exclusives',
    'AI & Machine Learning',
    'React & Vite',
    'Shorts Reels',
    'Music & Lofi',
    'Cybersecurity',
    'Podcasts',
    'Gaming',
];

export default function CategoryBar({ selectedCategory, onSelectCategory }) {
    return (
        <div className="category-bar-container">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => onSelectCategory(cat)}
                >
                    {cat}
                </button>
            ))}

            <style>{`
        .category-bar-container {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
          padding: 8px 0 14px 0;
          scrollbar-width: thin;
        }
        .category-pill {
          padding: 6px 14px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-full);
          color: var(--text-muted);
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .category-pill:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
        }
        .category-pill.active {
          background: var(--cyan);
          color: black;
          font-weight: 700;
          border-color: var(--cyan);
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
        }
      `}</style>
        </div>
    );
}
