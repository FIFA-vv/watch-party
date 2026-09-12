import React from 'react';
import { useDownload } from '../context/DownloadContext';
import { useSubscription } from '../context/SubscriptionContext';
import { History, HardDrive, Trash2, Play, Download, Crown } from 'lucide-react';

export default function LibraryView({ onSelectVideo }) {
    const { downloadHistory, removeDownloadedVideo, clearAllDownloads } = useDownload();
    const { subscription, activePlanDetails } = useSubscription();

    return (
        <div className="library-container">
            <div className="library-header">
                <History size={26} className="text-cyan" />
                <div>
                    <h2>Library & Offline Downloads</h2>
                    <p>Manage your downloaded video files, storage usage, and saved playback history.</p>
                </div>
            </div>

            {/* Downloads Section */}
            <div className="library-section glass-panel">
                <div className="section-title-row">
                    <h3><HardDrive size={18} className="text-emerald-400" /> Downloaded Offline Videos ({downloadHistory.length})</h3>
                    {downloadHistory.length > 0 && (
                        <button className="btn btn-danger btn-sm" onClick={clearAllDownloads}>
                            Clear Downloads
                        </button>
                    )}
                </div>

                {downloadHistory.length === 0 ? (
                    <div className="empty-dl-state">
                        <Download size={32} className="text-muted" />
                        <p>No offline videos downloaded yet. Click the Download button on any video!</p>
                    </div>
                ) : (
                    <div className="downloads-grid">
                        {downloadHistory.map((item) => (
                            <div key={item.id} className="dl-item-card">
                                <img src={item.thumbnail} alt={item.title} className="dl-thumb" />
                                <div className="dl-info">
                                    <span className="dl-title">{item.title}</span>
                                    <span className="dl-meta">{item.channelName} • {item.resolution} • {item.fileSize}</span>
                                    <span className="dl-date">Downloaded: {item.downloadedAt.substring(0, 10)}</span>
                                </div>
                                <button
                                    className="icon-delete-btn"
                                    onClick={() => removeDownloadedVideo(item.id)}
                                    title="Remove Download"
                                >
                                    <Trash2 size={16} className="text-rose-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .library-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px 0;
        }
        .library-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .library-header h2 {
          font-size: 1.4rem;
          font-weight: 800;
        }
        .library-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .library-section {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-title-row h3 {
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }
        .empty-dl-state {
          text-align: center;
          padding: 30px;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }
        .downloads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
        }
        .dl-item-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dl-thumb {
          width: 80px;
          height: 48px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }
        .dl-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }
        .dl-title {
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dl-meta {
          font-size: 0.75rem;
          color: var(--cyan);
        }
        .dl-date {
          font-size: 0.7rem;
          color: var(--text-dim);
        }
        .icon-delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
      `}</style>
        </div>
    );
}
