export function ProfilePage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow eyebrow-dark">Profile</p>
          <h1>Client account details</h1>
        </div>
      </div>

      <section className="panel-card profile-card">
        <div className="profile-intro">
          <div>
            <div className="profile-greeting">Jane Doe</div>
            <p>Client account · Active</p>
          </div>
          <div className="avatar-dot large">JD</div>
        </div>

        <div className="profile-form-grid">
          <label>
            Full name
            <input defaultValue="Jane Doe" />
          </label>
          <label>
            Email
            <input defaultValue="jane@grandforthlegal.com" />
          </label>
          <label>
            Phone
            <input defaultValue="+234 801 234 5678" />
          </label>
          <label>
            Company / Organization
            <input defaultValue="Harbor & Partners" />
          </label>
          <label className="full-span">
            Address
            <input defaultValue="12 Ikoyi Crescent, Lagos" />
          </label>
          <label className="full-span">
            Preferred contact method
            <select defaultValue="email">
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="sms">SMS</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}
