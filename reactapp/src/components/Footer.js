import React from "react";
import "../styles/layout.css";

function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Skill Tracker | Business Efficiency Simplified
    </footer>
  );
}

export default Footer;
