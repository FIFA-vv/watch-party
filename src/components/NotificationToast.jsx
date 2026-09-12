import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';

export default function NotificationToast() {
    const { notifications, removeToast } = useAuth();

    if (notifications.length === 0) return null;

    return (
        <div className="toast-container">
            {notifications.map((toast) => {
                const getIcon = () => {
                    switch (toast.type) {
                        case 'success':
                            return <CheckCircle size={20} className="text-emerald-400" />;
                        case 'warning':
                            return <AlertTriangle size={20} className="text-amber-400" />;
                        case 'security':
                            return <ShieldAlert size={20} className="text-rose-400" />;
                        default:
                            return <Info size={20} className="text-cyan-400" />;
                    }
                };

                return (
                    <div key={toast.id} className={`toast-card toast-${toast.type}`}>
                        <div className="toast-icon">{getIcon()}</div>
                        <div className="toast-content">
                            <span className="toast-title">{toast.title}</span>
                            <span className="toast-message">{toast.message}</span>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <X size={14} />
                        </button>
                    </div>
                );
            })}

            <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 420px;
          width: 100%;
          pointer-events: none;
        }
        .toast-card {
          pointer-events: auto;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-glass);
          border-left: 4px solid var(--cyan);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6);
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .toast-success { border-left-color: #10b981; }
        .toast-warning { border-left-color: #f59e0b; }
        .toast-security { border-left-color: #f43f5e; }
        .toast-info { border-left-color: #06b6d4; }
        .toast-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .toast-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .toast-message {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.35;
        }
        .toast-close {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          border-radius: 4px;
        }
        .toast-close:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}
