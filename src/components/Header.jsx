import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { format } from "date-fns";

const Header = () => {
  const { todayString } = useContext(AppContext);
  const location = useLocation();

  const formattedToday = todayString
    ? format(new Date(todayString), "eeee, MMMM dd, yyyy")
    : "";

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/rooms" className="brand-link">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" className="brand-icon">
              <path d="M19 12h-2v3h-6v-3H9v7h10v-7zm-2-5h-2v3h-4V7H9v3H7V5h14v14h-2V7z" />
            </svg>
            <span className="brand-name">LuxeStay</span>
          </div>
          <span className="brand-badge">Calendar Hub</span>
        </Link>

        <nav className="header-nav">
          <Link
            to="/rooms"
            className={`nav-item ${location.pathname === "/rooms" || location.pathname === "/" ? "active" : ""}`}
          >
            Dashboard
          </Link>
        </nav>

        <div className="header-meta">
          <div className="date-pill">
            <svg viewBox="0 0 24 24" className="pill-icon">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
            <span>{formattedToday}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
