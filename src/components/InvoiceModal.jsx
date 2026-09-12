import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { CheckCircle2, Download, FileText, Calendar, CreditCard, Mail } from 'lucide-react';

export default function InvoiceModal() {
    const {
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        activeInvoice,
        downloadInvoicePDF,
    } = useSubscription();

    if (!isInvoiceModalOpen || !activeInvoice) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content invoice-modal-box">
                {/* Success Header */}
                <div className="invoice-success-header">
                    <div className="success-icon-badge">
                        <CheckCircle2 size={32} className="text-emerald-400 animate-bounce" />
                    </div>
                    <h2>Payment Successful!</h2>
                    <p>Your subscription is now active. Official tax invoice receipt generated.</p>
                </div>

                {/* Invoice Summary Card */}
                <div className="invoice-card glass-panel">
                    <div className="inv-card-header">
                        <div>
                            <span className="inv-badge">OFFICIAL INVOICE</span>
                            <h3 className="inv-id">{activeInvoice.invoiceId}</h3>
                        </div>
                        <div className="inv-total">
                            <span className="total-label">Total Paid</span>
                            <span className="total-val">₹{activeInvoice.totalAmount}</span>
                        </div>
                    </div>

                    <div className="inv-details-grid">
                        <div className="inv-detail-item">
                            <span className="detail-label"><Mail size={13} /> Billed To</span>
                            <span className="detail-val">{activeInvoice.userName} ({activeInvoice.userEmail})</span>
                        </div>

                        <div className="inv-detail-item">
                            <span className="detail-label"><Calendar size={13} /> Date</span>
                            <span className="detail-val">{activeInvoice.createdAt} (Valid till {activeInvoice.expiryDate})</span>
                        </div>

                        <div className="inv-detail-item">
                            <span className="detail-label"><CreditCard size={13} /> Transaction ID</span>
                            <span className="detail-val">{activeInvoice.paymentId}</span>
                        </div>
                    </div>

                    {/* Line items */}
                    <div className="inv-items-table">
                        <div className="table-header">
                            <span>Item Description</span>
                            <span>Subtotal</span>
                        </div>
                        <div className="table-row">
                            <span>{activeInvoice.items[0].description}</span>
                            <span>₹{activeInvoice.baseAmount}</span>
                        </div>
                        {activeInvoice.discountAmount > 0 && (
                            <div className="table-row text-emerald-400">
                                <span>Yearly Discount Applied</span>
                                <span>- ₹{activeInvoice.discountAmount}</span>
                            </div>
                        )}
                        <div className="table-row text-muted">
                            <span>GST Tax (18%)</span>
                            <span>₹{activeInvoice.taxAmount}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="invoice-actions">
                    <button
                        className="btn btn-primary download-pdf-btn"
                        onClick={() => downloadInvoicePDF(activeInvoice)}
                    >
                        <Download size={18} />
                        <span>Download Official PDF Receipt</span>
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsInvoiceModalOpen(false)}
                    >
                        Continue to WeTube
                    </button>
                </div>
            </div>

            <style>{`
        .invoice-modal-box {
          max-width: 540px;
          text-align: center;
        }
        .invoice-success-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .success-icon-badge {
          width: 58px;
          height: 58px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .invoice-success-header h2 {
          font-size: 1.35rem;
          font-weight: 800;
        }
        .invoice-success-header p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .invoice-card {
          padding: 20px;
          text-align: left;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .inv-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 12px;
        }
        .inv-badge {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--cyan);
          letter-spacing: 0.05em;
        }
        .inv-id {
          font-size: 1.1rem;
          font-weight: 700;
          font-family: monospace;
        }
        .inv-total {
          text-align: right;
        }
        .total-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          display: block;
        }
        .total-val {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--emerald);
        }
        .inv-details-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.8rem;
        }
        .inv-detail-item {
          display: flex;
          justify-content: space-between;
        }
        .detail-label {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .detail-val {
          font-weight: 600;
        }
        .inv-items-table {
          background: rgba(15, 23, 42, 0.6);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.8rem;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 6px;
        }
        .table-row {
          display: flex;
          justify-content: space-between;
        }
        .invoice-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .download-pdf-btn {
          width: 100%;
          padding: 12px;
        }
      `}</style>
        </div>
    );
}
