const matters = [
  { name: 'Commercial Advisory', status: 'In progress', owner: 'Michael Imoh', updated: '2 days ago' },
  { name: 'Employment Policy Review', status: 'Pending review', owner: 'Aisha Okafor', updated: 'Today' },
  { name: 'Contract Renewal', status: 'Scheduled', owner: 'Samuel Ade', updated: '4 days ago' },
];

export function MattersPage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow eyebrow-dark">Matters</p>
          <h1>Legal matters overview</h1>
        </div>
      </div>

      <section className="panel-card table-panel">
        <div className="panel-header">
          <h2>Active matters</h2>
          <button type="button" className="ghost-button">Create matter</button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Matter</th>
                <th>Status</th>
                <th>Assigned attorney</th>
                <th>Last update</th>
              </tr>
            </thead>
            <tbody>
              {matters.map((matter) => (
                <tr key={matter.name}>
                  <td>{matter.name}</td>
                  <td><span className="status-badge neutral">{matter.status}</span></td>
                  <td>{matter.owner}</td>
                  <td>{matter.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
