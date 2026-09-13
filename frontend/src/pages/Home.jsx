import { Link } from "react-router-dom";
import Header from "../components/Header";

import { useAuth } from "../context/AuthContext";

import Dashboard from "../components/Dashboard";

function Home() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="app-shell">
        <Header />
        <main className="page-container loading-state">
          Loading your workspace...
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-shell">
        <Header />
        <main className="page-container welcome-page">
          <div className="welcome-layout">
            <section className="welcome-copy">
              <p className="eyebrow">Personal finance, made clear</p>
              <h1>Give every rupee a place to go.</h1>
              <p>
                NaviExpense brings your spending, income, and everyday decisions
                into one calm, useful workspace.
              </p>
              <div className="welcome-actions">
                <Link className="button-primary" to="/signup">
                  Create your workspace
                </Link>
                <Link className="header-link" to="/login">
                  I already have an account
                </Link>
              </div>
            </section>
            <aside className="welcome-note">
              <p className="eyebrow">A clearer monthly picture</p>
              <h2>Know what is left before the month knows for you.</h2>
              <p>
                Track the small purchases, spot the patterns, and build a money
                habit that feels manageable.
              </p>
            </aside>
          </div>
        </main>
      </div>
    );
  }

  if (user) {
    return (
      <div className="app-shell">
        <Header />
        <main className="page-container">
          <div className="dashboard-intro">
            <div>
              <p className="eyebrow">Your personal workspace</p>
              <h1>Good to see you, {user.fullName.split(" ")[0]}.</h1>
              <p>A simple view of where your money is moving this month.</p>
            </div>
            <Link className="button-primary" to="/transaction">
              Add transaction <span aria-hidden="true">+</span>
            </Link>
          </div>
          <Dashboard user={user} />
        </main>
      </div>
    );
  }
}

export default Home;
