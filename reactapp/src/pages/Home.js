import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";
import { FaUsers, FaBookOpen, FaChartLine } from "react-icons/fa";

export default function Homepage() {
  // State for contact form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: ""
  });
  const [status, setStatus] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit contact form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", content: "" });
      } else {
        setStatus("❌ Failed to send message.");
      }
    } catch (err) {
      setStatus("⚠️ Error connecting to server.");
    }
  };

  return (
    <div className="homepage">
      {/* HERO SECTION */}
      <header className="hero glass">
        <div className="hero-content">
          <h1>Welcome to Skill Tracker</h1>
          <p>
            Track skills, manage employees, and improve your team's productivity with a modern, intuitive dashboard.
          </p>
          <Link to="/employees">
            <button className="cta-btn">Get Started →</button>
          </Link>
        </div>
        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="Team working"
          />
        </div>
      </header>

      {/* FEATURES */}
      <section className="features">
        <Link to="/employees" className="card glass">
          <span className="icon"><FaUsers /></span>
          <h2>Employee Management</h2>
          <p>Add, edit, and view employee records with ease.</p>
        </Link>
        
        <Link to="/skills" className="card glass">
          <span className="icon"><FaBookOpen /></span>
          <h2>Skill Tracking</h2>
          <p>Maintain a skill database for better talent visibility.</p>
        </Link>
        
        <Link to="/reports" className="card glass">
          <span className="icon"><FaChartLine /></span>
          <h2>Reports & Insights</h2>
          <p>Generate reports to understand employee capabilities.</p>
        </Link>
      </section>


      {/* CONTACT FORM */}
      <section className="contact-section glass">
        <h2>Connect with Admin</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Message for admin..."
            rows="4"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send</button>
        </form>
        {status && <p className="status-msg">{status}</p>}
      </section>
    </div>
  );
}
