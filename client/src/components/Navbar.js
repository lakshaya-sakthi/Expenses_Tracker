import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api"; // Make sure this points to your Axios instance

export default function Navbar({ logout, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/auth/me"); // We'll create this endpoint in backend
        setUserName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      } mb-4 shadow-sm`}
    >
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <span>Expense Tracker of</span>
          {userName && (
            <span className="ms-2  ">
              {userName}
            </span>
          )}
        </Link>

        <div className="d-flex align-items-center">
          {/* Dark/Light Mode Toggle Button */}
          <button
            className={`btn me-2 ${
              darkMode ? "btn-light text-dark" : "btn-dark text-white"
            }`}
            onClick={toggleDarkMode}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Logout Button */}
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
