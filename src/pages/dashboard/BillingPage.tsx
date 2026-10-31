export function BillingPage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow eyebrow-dark">Billing</p>
          <h1>Payments and invoices</h1>
        </div>
      </div>

      <div className="two-column-grid">
        <section className="panel-card invoice-card">
          <div className="panel-header">
            <h2>Outstanding invoice</h2>
            <span className="status-badge neutral">Due in 6 days</span>
          </div>
          <div className="invoice-box">
            <div className="invoice-row"><span>Retainer payment</span><strong>₦1,250,000</strong></div>
            <div className="invoice-row"><span>VAT</span><strong>₦125,000</strong></div>
            <div className="invoice-row total"><span>Total</span><strong>₦1,375,000</strong></div>
          </div>
        </section>

        <section className="panel-card">
          <div className="panel-header">
            <h2>Payment history</h2>
          </div>
          <ul className="timeline-list">
            <li><strong>₦500,000</strong><span>Paid on Jul 12, 2026</span></li>
            <li><strong>₦750,000</strong><span>Paid on Aug 10, 2026</span></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
