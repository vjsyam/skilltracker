// src/components/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/layout.css";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <li>
          <Link to="/messages" onClick={() => setMenuOpen(false)}>Messages</Link>
        </li>
      </ul>
    </nav>
  );
}
