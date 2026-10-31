const documents = [
  { name: 'Commercial Agreement Draft.pdf', owner: 'You', updated: '2 hours ago', access: 'Secure' },
  { name: 'Corporate Governance Memo.docx', owner: 'Legal Team', updated: 'Yesterday', access: 'Review' },
  { name: 'Invoice & Payment Ledger.pdf', owner: 'Finance', updated: '3 days ago', access: 'Download' },
];

export function DocumentsPage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow eyebrow-dark">Documents</p>
          <h1>Secure document center</h1>
        </div>
      </div>

      <section className="panel-card">
        <div className="panel-header">
          <h2>Recent files</h2>
          <button type="button" className="ghost-button">Upload file</button>
        </div>

        <ul className="doc-list">
          {documents.map((document) => (
            <li key={document.name} className="doc-item">
              <div>
                <strong>{document.name}</strong>
                <span>{document.owner}</span>
              </div>
              <div>
                <small>{document.updated}</small>
                <span className="status-badge neutral">{document.access}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
