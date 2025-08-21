import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";
import { sendMessage } from "../services/messageService";
import { 
  FaUserFriends,
  FaUserGraduate, 
  FaChartBar,
  FaUserTie,
  FaClipboardCheck,
  FaChartPie
} from "react-icons/fa";

export default function Homepage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: ""
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    
    try {
      await sendMessage(formData);
      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", content: "" });
    } catch (err) {
      console.error("Error sending message:", err);
      setStatus("❌ Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== FEATURE DATA =====
  const primaryFeatures = [
    {
      icon: <FaUserGraduate />,
      title: "Skill Development",
      description: "Track and enhance professional skills with personalized learning paths."
    },
    {
      icon: <FaChartBar />,
      title: "Performance Analytics",
      description: "Get detailed insights with comprehensive analytics tools."
    },
    {
      icon: <FaUserFriends />,
      title: "Team Collaboration",
      description: "Enhance team productivity through better coordination and visibility."
    }
  ];

  const secondaryFeatures = [
    {
      icon: <FaUserTie />,
      title: "Employee Management",
      description: "Add, edit, and view employee records with ease.",
      link: "/employees"
    },
    {
      icon: <FaClipboardCheck />,
      title: "Skill Tracking",
      description: "Maintain a skill database for talent visibility.",
      link: "/skills"
    },
    {
      icon: <FaChartPie />,
      title: "Reports & Insights",
      description: "Generate reports to understand capabilities.",
      link: "/reports"
    }
  ];

  return (
    <div className="homepage">
      <header className="hero glass">
        <div className="hero-content">
          <h1>Powerful Features for Modern Businesses</h1>
          <p>
            Discover how our comprehensive skill tracking platform helps organizations 
            build stronger, more capable teams.
          </p>
          {/* <Link to="/employees">
            <button className="cta-btn">Get Started →</button>
          </Link> */}
        </div>
        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="Team working"
          />
        </div>
      </header>

      <section className="primary-features">
        <div className="section-header">
          <h2>Our Core Capabilities</h2>
          <p className="section-subtitle">
            Designed to help you maximize your team's potential
          </p>
        </div>

        <div className="features-grid">
          {primaryFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="secondary-features">
        <div className="section-header">
          <h2>Explore More Features</h2>
          <p className="section-subtitle">
            Additional tools to help you manage your workforce effectively
          </p>
        </div>

        <div className="features-grid-minimal">
          {secondaryFeatures.map((feature, index) => (
            <div key={index} className="feature-block">
              <div className="block-icon">{feature.icon}</div>
              <div className="block-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link to={feature.link} className="block-link">
                  Explore <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTACT FORM ===== */}
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
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </form>
        {status && <p className="status-msg">{status}</p>}
      </section>
    </div>
  );
}