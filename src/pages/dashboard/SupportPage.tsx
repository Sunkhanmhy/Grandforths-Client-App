const tickets = [
  { issue: 'Document access question', status: 'Open', priority: 'High' },
  { issue: 'Consultation schedule request', status: 'Resolved', priority: 'Low' },
  { issue: 'Billing clarification', status: 'Pending', priority: 'Medium' },
];

export function SupportPage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow eyebrow-dark">Support</p>
          <h1>Help and communication</h1>
        </div>
      </div>

      <section className="panel-card">
        <div className="panel-header">
          <h2>Recent support requests</h2>
          <button type="button" className="ghost-button">New request</button>
        </div>

        <div className="stack-list">
          {tickets.map((ticket) => (
            <div key={ticket.issue} className="summary-item">
              <div>
                <h3>{ticket.issue}</h3>
                <p>Priority: {ticket.priority}</p>
              </div>
              <span className="status-badge neutral">{ticket.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
