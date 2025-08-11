// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/layout.css";

export default function Navbar() {
  return (
    <nav className="navbar glass">
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Skill Tracker
        </Link>
      </div>
      <ul>
        <li><Link to="/employees">Employees</Link></li>
        <li><Link to="/skills">Skills</Link></li>
        <li><Link to="/departments">Departments</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/messages">Messages</Link></li> 
      </ul>
    </nav>
  );
}
