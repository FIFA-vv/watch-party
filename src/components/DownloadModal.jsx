import React, { useState } from 'react';
import { useDownload } from '../context/DownloadContext';
import { useSubscription } from '../context/SubscriptionContext';
import { Download, Film, HardDrive, ShieldCheck, AlertCircle, Crown } from 'lucide-react';

export default function DownloadModal() {
    const { downloadModalVideo, closeDownloadModal, startDownload, getEstimatedFileSize } = useDownload();
    const { subscription, activePlanDetails } = useSubscription();

    const [selectedResolution, setSelectedResolution] = useState('720p');

    if (!downloadModalVideo) return null;

    const resolutions = ['360p', '480p', '720p', '1080p', '4K'];

    const handleSubmit = (e) => {
        e.preventDefault();
        startDownload(downloadModalVideo, selectedResolution);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content download-modal-box">
                <div className="download-header">
                    <div className="title-group">
                        <Download size={22} className="text-cyan" />
                        <h3>Controlled Video Download</h3>
                    </div>
                    <button className="close-btn" onClick={closeDownloadModal}>✕</button>
                </div>

                <div className="video-summary-mini">
                    <img src={downloadModalVideo.thumbnail} alt={downloadModalVideo.title} className="mini-thumb" />
                    <div className="mini-info">
                        <span className="mini-title">{downloadModalVideo.title}</span>
                        <span className="mini-channel">{downloadModalVideo.channelName}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="download-form">
                    <span className="section-label">Select Download Resolution</span>
                    <div className="res-grid">
                        {resolutions.map((res) => {
                            const estSize = getEstimatedFileSize(downloadModalVideo.durationSec || 600, res);
                            const maxRes = activePlanDetails.limits.maxDownloadResolution;

                            const resRanks = { '360p': 0, '480p': 1, '720p': 2, '1080p': 3, '4K': 4 };
                            const isBlocked = (resRanks[res] || 0) > (resRanks[maxRes] || 0);

                            return (
                                <button
                                    key={res}
                                    type="button"
                                    className={`res-card ${selectedResolution === res ? 'active' : ''} ${isBlocked ? 'blocked' : ''}`}
                                    onClick={() => !isBlocked && setSelectedResolution(res)}
                                >
                                    <div className="res-info">
                                        <span className="res-name">{res}</span>
                                        <span className="res-size">{estSize}</span>
                                    </div>
                                    {isBlocked ? (
                                        <Crown size={14} className="text-amber-400" title="Upgrade Plan Required" />
                                    ) : (
                                        selectedResolution === res && <div className="dot-active" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="quota-status-card">
                        <div className="quota-row">
                            <span>Daily Download Quota:</span>
                            <strong>
                                {subscription.dailyDownloadsUsed} / {activePlanDetails.limits.dailyDownloadLimit === null ? 'Unlimited' : activePlanDetails.limits.dailyDownloadLimit} used
                            </strong>
                        </div>
                        <span className="quota-tier-notice">Current Tier: {subscription.plan}</span>
                    </div>

                    <button type="submit" className="btn btn-primary start-dl-btn">
                        <Download size={18} />
                        <span>Start Download ({selectedResolution})</span>
                    </button>
                </form>
            </div>

            <style>{`
        .download-modal-box {
          max-width: 460px;
        }
        .download-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .title-group h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }
        .video-summary-mini {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 10px;
          margin-bottom: 16px;
        }
        .mini-thumb {
          width: 70px;
          height: 42px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }
        .mini-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }
        .mini-title {
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mini-channel {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .download-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .section-label {
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 700;
        }
        .res-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
        }
        .res-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .res-card.active {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--cyan);
        }
        .res-card.blocked {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(0, 0, 0, 0.4);
        }
        .res-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .res-name {
          font-size: 0.88rem;
          font-weight: 700;
        }
        .res-size {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .dot-active {
          width: 8px;
          height: 8px;
          background: var(--cyan);
          border-radius: 50%;
        }
        .quota-status-card {
          background: rgba(30, 41, 59, 0.6);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .quota-row {
          display: flex;
          justify-content: space-between;
        }
        .quota-tier-notice {
          font-size: 0.72rem;
          color: var(--text-dim);
        }
        .start-dl-btn {
          width: 100%;
          padding: 12px;
        }
      `}</style>
        </div>
    );
}
