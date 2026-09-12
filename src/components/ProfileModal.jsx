import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import {
    User, Shield, Key, Sun, Moon, Clock, MapPin, Smartphone,
    Activity, Trash2, CheckCircle2, RotateCcw, Crown, Download, FileText
} from 'lucide-react';

export default function ProfileModal() {
    const {
        isProfileModalOpen,
        setIsProfileModalOpen,
        user,
        currentTheme,
        setTheme,
        toggleAutoThemeByLoginTime,
        auditLogs,
        revokeTrustedDevice,
        revokeTrustedLocation,
        resetToDefaultProfile,
        setIsAuthModalOpen,
    } = useAuth();

    const { subscription, activePlanDetails, setIsPricingModalOpen, downloadInvoicePDF } = useSubscription();

    const [activeTab, setActiveTab] = useState('overview');

    if (!isProfileModalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content profile-modal-box">
                {/* Header */}
                <div className="profile-header">
                    <div className="user-profile-summary">
                        <img src={user.avatar} alt={user.name} className="profile-avatar" />
                        <div>
                            <h3 className="profile-name">{user.name}</h3>
                            <p className="profile-email">{user.email}</p>
                            <div className="profile-badges">
                                <span className="badge badge-host">{user.role}</span>
                                <span className={`badge ${subscription.plan === 'Gold' ? 'badge-rec' : 'badge-live'}`}>
                                    <Crown size={12} /> {subscription.plan} Tier
                                </span>
                            </div>
                        </div>
                    </div>

                    <button className="close-btn" onClick={() => setIsProfileModalOpen(false)}>✕</button>
                </div>

                {/* Tab Navigation */}
                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <User size={15} /> Profile & Subscription
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <Shield size={15} /> Risk Security
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        <Activity size={15} /> Audit Logs ({auditLogs.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="profile-tab-body">
                    {activeTab === 'overview' && (
                        <div className="tab-pane">
                            <div className="card-box">
                                <h4><Crown size={16} className="text-amber-400" /> Active Subscription Plan</h4>
                                <div className="plan-status-row">
                                    <div>
                                        <span className="plan-name-title">{activePlanDetails.name}</span>
                                        <p className="plan-desc">{activePlanDetails.tagline}</p>
                                    </div>
                                    <button
                                        className="btn btn-cyan btn-sm"
                                        onClick={() => {
                                            setIsProfileModalOpen(false);
                                            setIsPricingModalOpen(true);
                                        }}
                                    >
                                        Upgrade Plan
                                    </button>
                                </div>

                                <div className="plan-usage-grid">
                                    <div className="usage-stat-card">
                                        <span className="usage-label">Daily Watch Used</span>
                                        <span className="usage-val">
                                            {subscription.dailyWatchTimeUsed} / {activePlanDetails.limits.dailyWatchLimitMinutes === null ? '∞' : `${activePlanDetails.limits.dailyWatchLimitMinutes}m`}
                                        </span>
                                    </div>
                                    <div className="usage-stat-card">
                                        <span className="usage-label">Daily Downloads Used</span>
                                        <span className="usage-val">
                                            {subscription.dailyDownloadsUsed} / {activePlanDetails.limits.dailyDownloadLimit === null ? '∞' : activePlanDetails.limits.dailyDownloadLimit}
                                        </span>
                                    </div>
                                </div>

                                {subscription.invoiceHistory && subscription.invoiceHistory.length > 0 && (
                                    <div className="recent-invoices-box">
                                        <span className="section-sublabel">Recent Invoice Receipts</span>
                                        <div className="invoice-mini-list">
                                            {subscription.invoiceHistory.slice(0, 3).map((inv) => (
                                                <div key={inv.invoiceId} className="invoice-mini-item">
                                                    <div>
                                                        <strong>{inv.invoiceId}</strong> ({inv.planName})
                                                        <span className="inv-date">{inv.createdAt}</span>
                                                    </div>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => downloadInvoicePDF(inv)}>
                                                        <Download size={13} /> PDF
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Theme Settings */}
                            <div className="card-box">
                                <h4><Clock size={16} className="text-cyan-400" /> Adaptive IST Theme Engine</h4>

                                <div className="theme-toggle-row">
                                    <div>
                                        <strong>Auto-Theme by Login Time (IST)</strong>
                                        <p className="field-hint">Defaults to Light Mode between 10:00 AM – 12:00 PM IST; Dark Mode otherwise.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle-checkbox"
                                        checked={user.autoThemeByLoginTime}
                                        onChange={(e) => toggleAutoThemeByLoginTime(e.target.checked)}
                                    />
                                </div>

                                <div className="manual-theme-selector">
                                    <span>Manual Override:</span>
                                    <button
                                        className={`btn btn-sm ${currentTheme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setTheme('light')}
                                    >
                                        <Sun size={14} /> Light Theme
                                    </button>
                                    <button
                                        className={`btn btn-sm ${currentTheme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setTheme('dark')}
                                    >
                                        <Moon size={14} /> Dark Theme
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="tab-pane">
                            <div className="card-box">
                                <h4><Smartphone size={16} className="text-emerald-400" /> Trusted Devices</h4>
                                <div className="list-items">
                                    {user.trustedDevices.map((dev, idx) => (
                                        <div key={idx} className="list-item-row">
                                            <div className="item-info">
                                                <Smartphone size={15} />
                                                <span>{dev}</span>
                                            </div>
                                            {user.trustedDevices.length > 1 && (
                                                <button
                                                    className="icon-action-btn"
                                                    onClick={() => revokeTrustedDevice(dev)}
                                                    title="Revoke device"
                                                >
                                                    <Trash2 size={14} className="text-rose-400" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card-box">
                                <h4><MapPin size={16} className="text-cyan-400" /> Trusted Locations (Cities & States)</h4>
                                <div className="list-items">
                                    {user.trustedCities.map((city, idx) => (
                                        <div key={idx} className="list-item-row">
                                            <div className="item-info">
                                                <MapPin size={15} />
                                                <span>{city}, India</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="security-actions-row">
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setIsProfileModalOpen(false);
                                        setIsAuthModalOpen(true);
                                    }}
                                >
                                    <Key size={14} /> Simulate Login Test
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={resetToDefaultProfile}>
                                    <RotateCcw size={14} /> Reset Security Profile
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="tab-pane">
                            <div className="audit-logs-table">
                                {auditLogs.map((log) => (
                                    <div key={log.id} className="audit-log-card">
                                        <div className="log-top">
                                            <span className="log-time">{log.formattedTimeIST}</span>
                                            <span className="badge badge-host">{log.verificationMethod}</span>
                                        </div>
                                        <div className="log-details">
                                            <div>📍 Location: <strong>{log.city}, {log.state}</strong></div>
                                            <div>💻 Device: <strong>{log.device}</strong></div>
                                            <div>🎨 Applied Theme: <strong>{log.appliedTheme.toUpperCase()}</strong></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .profile-modal-box {
          max-width: 680px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }
        .profile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-glass);
        }
        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .profile-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--cyan);
        }
        .profile-name {
          font-size: 1.15rem;
          font-weight: 700;
        }
        .profile-email {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .profile-badges {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }
        .profile-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid var(--border-glass);
          padding: 12px 0;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border-radius: var(--radius-md);
        }
        .tab-btn.active {
          background: rgba(139, 92, 246, 0.2);
          color: var(--text-main);
          border: 1px solid var(--primary);
        }
        .profile-tab-body {
          padding-top: 16px;
          overflow-y: auto;
          flex: 1;
        }
        .tab-pane {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .card-box {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .card-box h4 {
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
        }
        .plan-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.6);
          padding: 12px;
          border-radius: var(--radius-md);
        }
        .plan-name-title {
          font-weight: 700;
          font-size: 1rem;
          color: var(--cyan);
        }
        .plan-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .plan-usage-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .usage-stat-card {
          background: rgba(15, 23, 42, 0.6);
          padding: 10px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .usage-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .usage-val {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .invoice-mini-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .invoice-mini-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
          background: rgba(15, 23, 42, 0.4);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
        }
        .inv-date {
          margin-left: 8px;
          color: var(--text-dim);
        }
        .theme-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .toggle-checkbox {
          width: 20px;
          height: 20px;
          accent-color: var(--cyan);
          cursor: pointer;
        }
        .manual-theme-selector {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
        }
        .list-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .list-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.6);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
        }
        .item-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .icon-action-btn {
          background: none;
          border: none;
          cursor: pointer;
        }
        .security-actions-row {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
        }
        .audit-logs-table {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .audit-log-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .log-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .log-time {
          font-size: 0.78rem;
          color: var(--cyan);
          font-weight: 600;
        }
        .log-details {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
      `}</style>
        </div>
    );
}
