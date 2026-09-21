import {
  FiLogOut,
  FiShoppingBag,
  FiBriefcase,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";

export default function Dashboard({
  user,
  onLogout,
}) {
  const firstName =
    user.fullName?.split(" ")[0] ||
    user.name?.split(" ")[0] ||
    "there";

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="brand-logo">CM</div>

          <div>
            <strong>CampusMart</strong>
            <span>Campus marketplace</span>
          </div>
        </div>

        <button
          className="logout-icon-button"
          onClick={onLogout}
          title="Logout"
        >
          <FiLogOut />
        </button>
      </header>

      <main className="dashboard-content">
        <section className="welcome-card">
          <div>
            <span className="welcome-label">
              Welcome back
            </span>

            <h1>
              Hey {firstName} 
            </h1>

            <p>
              Everything you need on campus,
              all in one place.
            </p>
          </div>

          <div className="welcome-avatar">
            {firstName
              .charAt(0)
              .toUpperCase()}
          </div>
        </section>

        <h2 className="section-title">
          What would you like to do?
        </h2>

        <div className="dashboard-grid">
          <div className="dashboard-option">
            <div className="dashboard-option-icon">
              <FiShoppingBag />
            </div>

            <h3>Shop</h3>

            <p>
              Discover products from campus
              sellers.
            </p>
          </div>

          <div className="dashboard-option">
            <div className="dashboard-option-icon">
              <FiBriefcase />
            </div>

            <h3>Gigs</h3>

            <p>
              Find or post useful campus
              jobs.
            </p>
          </div>

          <div className="dashboard-option">
            <div className="dashboard-option-icon">
              <FiMessageCircle />
            </div>

            <h3>Messages</h3>

            <p>
              Chat with buyers and sellers.
            </p>
          </div>

          <div className="dashboard-option">
            <div className="dashboard-option-icon">
              <FiUser />
            </div>

            <h3>Profile</h3>

            <p>
              Manage your CampusMart account.
            </p>
          </div>
        </div>

        <section className="account-summary">
          <h2>Your account</h2>

          <div className="summary-row">
            <span>Name</span>
            <strong>
              {user.fullName}
            </strong>
          </div>

          <div className="summary-row">
            <span>Email</span>
            <strong>
              {user.email}
            </strong>
          </div>

          <div className="summary-row">
            <span>Country</span>
            <strong>
              {user.country}
            </strong>
          </div>
        </section>
      </main>
    </div>
  );
}