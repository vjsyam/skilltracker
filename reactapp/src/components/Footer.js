import React from "react";
import "../styles/layout.css";

const QUOTES = [
  "Learning never exhausts the mind. — Leonardo da Vinci",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "What gets measured gets improved. — Peter Drucker",
  "An investment in knowledge pays the best interest. — Benjamin Franklin",
  "The future depends on what you do today. — Mahatma Gandhi"
];

function Footer() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return (
    <footer className="footer">
      <div>{quote}</div>
      <div>© {new Date().getFullYear()} Skill Tracker | Business Efficiency Simplified</div>
    </footer>
  );
}

export default Footer;
