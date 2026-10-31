const stats = [
  { label: 'Active matters', value: '06', detail: '+2 this quarter' },
  { label: 'Upcoming sessions', value: '03', detail: 'Next 14 days' },
  { label: 'Documents shared', value: '24', detail: 'Secure access enabled' },
];

const tasks = [
  { title: 'Commercial advisory', detail: 'Review due diligence notes', tag: 'In progress' },
  { title: 'Employment policy review', detail: 'Awaiting attorney comments', tag: 'Pending' },
  { title: 'Contract renewal', detail: 'Check revised clause set', tag: 'Scheduled' },
];

export function OverviewPage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow eyebrow-dark">Client dashboard</p>
          <h1>Welcome back</h1>
        </div>
        <button type="button" className="primary-button compact-button">Request consultation</button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.detail}</small>
          </article>
        ))}
      </div>

      <div className="two-column-grid">
        <section className="panel-card">
          <div className="panel-header">
            <h2>Current matters</h2>
            <button type="button" className="ghost-button">View all</button>
          </div>
          <div className="activity-list">
            {tasks.map((task) => (
              <div key={task.title} className="summary-item">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.detail}</p>
                </div>
                <span className="status-badge success">{task.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel-card">
          <div className="panel-header">
            <h2>Recent activity</h2>
          </div>
          <ul className="timeline-list">
            <li><strong>New document uploaded</strong><span>Commercial agreement package</span></li>
            <li><strong>Consultation confirmed</strong><span>Thursday, 10:30 AM</span></li>
            <li><strong>Billing update</strong><span>Invoice issued for retainer</span></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
