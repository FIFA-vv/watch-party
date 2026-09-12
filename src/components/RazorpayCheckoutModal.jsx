import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, Smartphone, Building2 } from 'lucide-react';

export default function RazorpayCheckoutModal() {
    const {
        pendingUpgradePlan,
        setPendingUpgradePlan,
        upgradePlan,
        plans,
        billingCycle,
        subscription,
    } = useSubscription();

    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [upiId, setUpiId] = useState('alex@upi');
    const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!pendingUpgradePlan) return null;

    const targetPlan = plans[pendingUpgradePlan];
    const price = billingCycle === 'yearly' ? targetPlan.priceYearly : targetPlan.priceMonthly;

    const handleSimulatePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        setTimeout(() => {
            const dummyPayId = `pay_rzp_${Math.random().toString(36).substring(2, 10)}`;
            const dummyOrderId = `order_${Math.random().toString(36).substring(2, 10)}`;

            upgradePlan(
                pendingUpgradePlan,
                dummyPayId,
                dummyOrderId,
                paymentMethod === 'upi' ? `Razorpay UPI (${upiId})` : 'Razorpay Card (VISA)'
            );

            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content rzp-modal-box">
                {/* Header */}
                <div className="rzp-header">
                    <div className="rzp-brand">
                        <div className="rzp-logo-badge">R</div>
                        <div>
                            <h3>Razorpay Secure Checkout</h3>
                            <span className="rzp-merchant">Merchant: WeTube Streaming Inc.</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setPendingUpgradePlan(null)}>✕</button>
                </div>

                {/* Order Summary */}
                <div className="rzp-summary-card">
                    <div className="summary-left">
                        <span className="plan-title">{targetPlan.name} ({billingCycle.toUpperCase()})</span>
                        <span className="user-email">{subscription.userEmail}</span>
                    </div>
                    <div className="summary-right">
                        <span className="total-amount">₹{price}</span>
                        <span className="tax-inclusive">Incl. 18% GST</span>
                    </div>
                </div>

                {/* Payment Methods */}
                <form onSubmit={handleSimulatePayment} className="rzp-form">
                    <span className="method-label">Select Payment Method</span>
                    <div className="methods-grid">
                        <button
                            type="button"
                            className={`method-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('upi')}
                        >
                            <Smartphone size={18} />
                            <span>UPI / QR</span>
                        </button>

                        <button
                            type="button"
                            className={`method-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <CreditCard size={18} />
                            <span>Card</span>
                        </button>

                        <button
                            type="button"
                            className={`method-tab ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('netbanking')}
                        >
                            <Building2 size={18} />
                            <span>Netbanking</span>
                        </button>
                    </div>

                    {paymentMethod === 'upi' && (
                        <div className="method-field-box">
                            <label>Enter Virtual Payment Address (VPA)</label>
                            <input
                                type="text"
                                className="input-field"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="username@upi"
                                required
                            />
                        </div>
                    )}

                    {paymentMethod === 'card' && (
                        <div className="method-field-box">
                            <label>Card Number</label>
                            <input
                                type="text"
                                className="input-field"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="security-guarantee">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <span>256-Bit SSL Encrypted Test Sandbox Transaction</span>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary pay-now-btn"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <span>Processing Payment...</span>
                        ) : (
                            <span>Pay ₹{price} & Upgrade Now</span>
                        )}
                    </button>
                </form>
            </div>

            <style>{`
        .rzp-modal-box {
          max-width: 480px;
        }
        .rzp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-glass);
        }
        .rzp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .rzp-logo-badge {
          width: 38px;
          height: 38px;
          background: #0284c7;
          color: white;
          font-weight: 800;
          font-size: 1.3rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rzp-merchant {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .rzp-summary-card {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 16px 0;
        }
        .plan-title {
          font-weight: 700;
          font-size: 0.95rem;
          display: block;
        }
        .user-email {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .total-amount {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--cyan);
          display: block;
        }
        .tax-inclusive {
          font-size: 0.72rem;
          color: var(--text-dim);
        }
        .rzp-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .method-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .methods-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .method-tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 10px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.78rem;
          cursor: pointer;
        }
        .method-tab.active {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--cyan);
          color: var(--text-main);
          font-weight: 600;
        }
        .method-field-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .method-field-box label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .security-guarantee {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
          background: rgba(16, 185, 129, 0.1);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
        }
        .pay-now-btn {
          width: 100%;
          padding: 12px;
        }
      `}</style>
        </div>
    );
}
