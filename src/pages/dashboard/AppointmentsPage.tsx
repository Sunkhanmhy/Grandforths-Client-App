const appointments = [
  { title: 'Initial consultation', date: 'Aug 18, 2026', time: '10:30 AM', type: 'Virtual meeting', status: 'Confirmed' },
  { title: 'Document review', date: 'Aug 23, 2026', time: '2:00 PM', type: 'In-office', status: 'Pending' },
  { title: 'Contract negotiation', date: 'Aug 28, 2026', time: '9:00 AM', type: 'Conference call', status: 'Scheduled' },
];

export function AppointmentsPage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow eyebrow-dark">Appointments</p>
          <h1>Schedule and meetings</h1>
        </div>
      </div>

      <section className="panel-card">
        <div className="panel-header">
          <h2>Upcoming appointments</h2>
          <button type="button" className="ghost-button">Book session</button>
        </div>

        <div className="stack-list">
          {appointments.map((item) => (
            <div key={item.title} className="summary-item appointment-item">
              <div>
                <h3>{item.title}</h3>
                <p>{item.date} · {item.time}</p>
                <p>{item.type}</p>
              </div>
              <span className="status-badge success">{item.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
