import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { AdminOnly } from "./RoleBasedAccess";
import "../styles/layout.css";
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <nav className="navbar glass">
      <div className="logo">
        <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}>
          Skill Tracker
        </Link>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={menuOpen ? "active" : ""}>
        <li>
          <Link to="/employees" onClick={() => setMenuOpen(false)}>Employees</Link>
        </li>
        <li>
          <Link to="/skills" onClick={() => setMenuOpen(false)}>Skills</Link>
        </li>
        <li>
          <Link to="/departments" onClick={() => setMenuOpen(false)}>Departments</Link>
        </li>
        <li>
          <Link to="/reports" onClick={() => setMenuOpen(false)}>Reports</Link>
        </li>
        <AdminOnly>
          <li>
            <Link to="/messages" onClick={() => setMenuOpen(false)}>Messages</Link>
          </li>
        </AdminOnly>
        {/* <AdminOnly>
          <li>
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          </li>
        </AdminOnly> */}
        {user && (
          <>
            <li className="user-info">
              <FaUser /> {user.name} ({user.role})
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
