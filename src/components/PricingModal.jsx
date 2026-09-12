import React from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { COMPARISON_MATRIX } from '../data/plansData';
import { Crown, Check, X, Sparkles, ShieldCheck } from 'lucide-react';

export default function PricingModal() {
    const {
        isPricingModalOpen,
        setIsPricingModalOpen,
        plans,
        subscription,
        billingCycle,
        setBillingCycle,
        openCheckout,
    } = useSubscription();

    if (!isPricingModalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content pricing-modal-box">
                {/* Header */}
                <div className="pricing-header">
                    <div className="pricing-title-group">
                        <Crown size={28} className="text-amber-400 animate-bounce" />
                        <div>
                            <h2>Choose Your Premium Tier</h2>
                            <p>Unlock 4K streaming, unlimited watch time, offline downloads, and ad-free experience.</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={() => setIsPricingModalOpen(false)}>✕</button>
                </div>

                {/* Billing Cycle Switch */}
                <div className="billing-toggle-container">
                    <span className={billingCycle === 'monthly' ? 'active-cycle' : ''}>Monthly Billing</span>
                    <div
                        className="toggle-track"
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    >
                        <div className={`toggle-thumb ${billingCycle === 'yearly' ? 'yearly' : ''}`} />
                    </div>
                    <span className={billingCycle === 'yearly' ? 'active-cycle' : ''}>
                        Yearly Billing <span className="discount-tag">Save 20%</span>
                    </span>
                </div>

                {/* Plans Grid */}
                <div className="plans-grid">
                    {Object.values(plans).map((plan) => {
                        const isCurrent = subscription.plan === plan.id;
                        const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

                        return (
                            <div
                                key={plan.id}
                                className={`plan-card ${plan.popular ? 'popular' : ''} ${isCurrent ? 'current' : ''}`}
                            >
                                {plan.badgeText && <span className="plan-badge">{plan.badgeText}</span>}

                                <h3 className="plan-name">{plan.name}</h3>
                                <p className="plan-tagline">{plan.tagline}</p>

                                <div className="plan-price-box">
                                    <span className="currency">{plan.currency}</span>
                                    <span className="amount">{price}</span>
                                    <span className="per-period">/{billingCycle === 'yearly' ? 'yr' : 'mo'}</span>
                                </div>

                                <button
                                    className={`btn ${isCurrent ? 'btn-secondary' : plan.popular ? 'btn-primary' : 'btn-cyan'} plan-cta`}
                                    onClick={() => openCheckout(plan.id)}
                                    disabled={isCurrent}
                                >
                                    {isCurrent ? 'Current Active Plan' : `Upgrade to ${plan.id}`}
                                </button>

                                <div className="features-list">
                                    {plan.features.map((feat, idx) => (
                                        <div key={idx} className="feature-item">
                                            <Check size={14} className="text-emerald-400" />
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Comparison Table */}
                <div className="matrix-section">
                    <h3>Full Feature Comparison</h3>
                    <div className="table-responsive">
                        <table className="matrix-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Free</th>
                                    <th>Bronze</th>
                                    <th>Silver</th>
                                    <th>Gold VIP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARISON_MATRIX.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="row-feature">{row.feature}</td>
                                        <td>{row.free}</td>
                                        <td>{row.bronze}</td>
                                        <td>{row.silver}</td>
                                        <td className="gold-col">{row.gold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
        .pricing-modal-box {
          max-width: 1040px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .pricing-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .pricing-title-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pricing-title-group h2 {
          font-size: 1.4rem;
          font-weight: 800;
        }
        .pricing-title-group p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .billing-toggle-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 24px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .active-cycle {
          color: var(--cyan);
        }
        .discount-tag {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          margin-left: 4px;
        }
        .toggle-track {
          width: 52px;
          height: 28px;
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-full);
          cursor: pointer;
          position: relative;
          padding: 3px;
        }
        .toggle-thumb {
          width: 20px;
          height: 20px;
          background: var(--cyan);
          border-radius: 50%;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .toggle-thumb.yearly {
          transform: translateX(24px);
        }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 30px;
        }
        .plan-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.22s ease;
        }
        .plan-card:hover {
          transform: translateY(-4px);
          border-color: var(--cyan);
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .plan-card.popular {
          border-color: var(--amber);
          background: rgba(245, 158, 11, 0.05);
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
        }
        .plan-card.current {
          border-color: var(--emerald);
        }
        .plan-badge {
          position: absolute;
          top: -12px;
          right: 16px;
          background: var(--amber);
          color: black;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .plan-name {
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .plan-tagline {
          font-size: 0.78rem;
          color: var(--text-muted);
          min-height: 36px;
          line-height: 1.3;
        }
        .plan-price-box {
          margin: 16px 0;
          display: flex;
          align-items: baseline;
        }
        .currency {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .amount {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-main);
          margin-left: 2px;
        }
        .per-period {
          font-size: 0.8rem;
          color: var(--text-dim);
          margin-left: 4px;
        }
        .plan-cta {
          width: 100%;
          padding: 10px;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .matrix-section {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          padding: 20px;
        }
        .matrix-section h3 {
          font-size: 1rem;
          margin-bottom: 14px;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .matrix-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
          text-align: left;
        }
        .matrix-table th, .matrix-table td {
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-glass);
        }
        .matrix-table th {
          background: rgba(30, 41, 59, 0.8);
          color: var(--text-main);
          font-weight: 700;
        }
        .row-feature {
          font-weight: 600;
          color: var(--text-main);
        }
        .gold-col {
          color: var(--amber);
          font-weight: 700;
        }
      `}</style>
        </div>
    );
}
