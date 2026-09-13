import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch(`${API_URL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);

    navigate("/");
  }

  return (
    <nav className="site-header">
      <Link className="brand" to="/">
        <span className="brand-mark">N</span>
        <span>NaviExpense</span>
      </Link>

      {user ? (
        <div className="header-user">
          <span>{user.fullName}</span>
          <span className="avatar">
            {user.fullName?.charAt(0).toUpperCase()}
          </span>

          <button className="text-button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      ) : (
        <div className="header-actions">
          <Link className="header-link" to="/login">
            Login
          </Link>

          <Link className="primary-link" to="/signup">
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
