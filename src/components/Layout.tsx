import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: '⌂' },
  { label: 'Matters', path: '/dashboard/matters', icon: '▣' },
  { label: 'Appointments', path: '/dashboard/appointments', icon: '◫' },
  { label: 'Documents', path: '/dashboard/documents', icon: '☰' },
  { label: 'Billing', path: '/dashboard/billing', icon: '₦' },
  { label: 'Support', path: '/dashboard/support', icon: '✦' },
  { label: 'Profile', path: '/dashboard/profile', icon: '◉' },
];

export function DashboardLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">H</div>
          <div>
            <div className="brand-name">Grandforth Legal Practitioners</div>
            <div className="brand-subtitle">Client Portal</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="search-box">
            <span>⌕</span>
            <input type="text" placeholder="Search matters, documents, payments…" />
          </div>
          <div className="topbar-right">
            <button type="button" className="notification-button" aria-label="Notifications">
              🔔
              <span className="notification-badge">3</span>
            </button>
            <button type="button" className="profile-chip-button">
              <div className="profile-chip">
                <div className="avatar-dot">H</div>
                <div>
                  <strong>Client</strong>
                  <span>Secure account</span>
                </div>
              </div>
            </button>
          </div>
        </header>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
