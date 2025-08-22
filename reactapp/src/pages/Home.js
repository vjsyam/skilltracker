import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";
import { sendMessage } from "../services/messageService";
import { 
  FaUserFriends,
  FaUserGraduate, 
  FaChartBar,
  FaUserTie,
  FaClipboardCheck,
  FaChartPie,
  FaIdBadge,
  FaEnvelope
} from "react-icons/fa";
import { authService } from "../services/authService";

export default function Homepage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: ""
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useMemo(() => authService.getCurrentUser(), []);
  const isAdmin = user?.role === "ADMIN";

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

  const secondaryFeaturesAdmin = [
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
    },
    {
      icon: <FaUserFriends />,
      title: "Departments",
      description: "Organize teams and manage assignments.",
      link: "/departments"
    },
    {
      icon: <FaEnvelope />,
      title: "Messages",
      description: "Review incoming messages from users.",
      link: "/messages"
    },
    {
      icon: <FaIdBadge />,
      title: "Users",
      description: "Browse accounts available to link employees.",
      link: "/users"
    },
    {
      icon: <FaUserGraduate />,
      title: "New Skills",
      description: "Curate and add learning catalog items.",
      link: "/new-skills"
    }
  ];

  const secondaryFeaturesEmployee = [
    {
      icon: <FaIdBadge />,
      title: "My Profile",
      description: "View your department, manager, and skills.",
      link: "/me"
    },
    {
      icon: <FaUserGraduate />,
      title: "Explore New Skills",
      description: "Discover 100 skills and what they offer.",
      link: "/new-skills"
    }
  ];

  const secondaryFeatures = isAdmin ? secondaryFeaturesAdmin : secondaryFeaturesEmployee;

  return (
    <div className="homepage">
      <header className="hero glass">
        <div className="hero-content">
          <h1>Powerful Features for Modern Businesses</h1>
          <p>
            Discover how our comprehensive skill tracking platform helps organizations 
            build stronger, more capable teams.
          </p>
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
          <h2>{isAdmin ? "Explore More Features" : "Your Quick Links"}</h2>
          <p className="section-subtitle">
            {isAdmin ? "Additional tools to help you manage your workforce effectively" : "Access your profile and discover skills"}
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
                  {isAdmin ? "Explore" : "Open"} <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

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