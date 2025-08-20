import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";
import {
  FaChartLine,
  FaUsers,
  FaTools,
  FaShieldAlt,
  FaRocket,
  FaArrowRight,
  FaChartPie,
  FaSortAmountUpAlt
} from "react-icons/fa";

export default function Landing() {
  return (
    <div className="landing-page">
      <section className="landing-hero glass">
        <div className="hero-content">
          <h1>Empower Your Workforce with SkillSync</h1>
          <p className="hero-subtitle">
            The complete solution for tracking employee skills, managing
            departments, and optimizing your organization's talent.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn primary">
              Get Started <FaArrowRight />
            </Link>
            {/* <Link to="/features" className="btn secondary">
              Learn More
            </Link> */}
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3058/3058972.png"
            alt="Team collaboration"
          />
        </div>
      </section>

      <section className="landing-features">
        <h2 >Why Choose SkillSync?</h2>
        <div className="features-grid">
          <div className="feature-card glass">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Comprehensive Analytics</h3>
            <p>
              Gain insights into your workforce capabilities with powerful
              reporting and visualization tools.
            </p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Employee Management</h3>
            <p>
              Easily track and manage employee information, departments, and
              reporting structures.
            </p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon">
              <FaTools />
            </div>
            <h3>Skill Tracking</h3>
            <p>
              Maintain a complete inventory of employee skills and competencies
              across your organization.
            </p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3>Secure Access</h3>
            <p>
              Role-based access control ensures data security while providing
              appropriate access levels.
            </p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon">
              <FaChartPie />
            </div>
            <h3>Interactive Reports</h3>
            <p>
              Generate and visualize performance reports with interactive charts
              for better decision-making.
            </p>
          </div>

          <div className="feature-card glass">
            <div className="feature-icon">
              <FaSortAmountUpAlt />
            </div>
            <h3>Smart Sorting & Filters</h3>
            <p>
              Quickly find employees, departments, or skills with advanced
              sorting and filtering tools.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-cta glass">
        <div className="cta-content">
          <h2>Ready to Transform Your Workforce Management?</h2>
          <p>
            Join hundreds of organizations that trust SkillSync for their
            employee development and talent management needs.
          </p>
          <Link to="/signup" className="btn primary large">
            <FaRocket /> Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
