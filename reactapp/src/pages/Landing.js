import React, { useState, useEffect } from "react";
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
  FaSortAmountUpAlt,
  FaStar,
  FaQuoteLeft,
  FaPlay
} from "react-icons/fa";

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}+</span>;
}

// Floating Particle Component
function FloatingParticles() {
  return (
    <div className="floating-particles">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 4}s`
        }} />
      ))}
    </div>
  );
}

// Testimonial Component
function Testimonial({ name, role, company, content, rating }) {
  return (
    <div className="testimonial-card glass">
      <div className="testimonial-header">
        <div className="stars">
          {[...Array(rating)].map((_, i) => <FaStar key={i} className="star" />)}
        </div>
        <FaQuoteLeft className="quote-icon" />
      </div>
      <p className="testimonial-content">{content}</p>
      <div className="testimonial-author">
        <div className="author-avatar">{name.charAt(0)}</div>
        <div>
          <h4>{name}</h4>
          <p>{role} at {company}</p>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director",
      company: "TechCorp",
      content: "SkillSync transformed how we track employee development. The analytics are incredible!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Operations Manager",
      company: "InnovateLab",
      content: "Finally, a tool that makes workforce management actually enjoyable to use.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Team Lead",
      company: "GrowthStart",
      content: "The skill tracking features helped us identify talent gaps and plan training effectively.",
      rating: 5
    }
  ];

  return (
    <div className="landing-page">
      <FloatingParticles />
      
      <section className={`landing-hero glass ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-content">
          <div className="hero-badge">
            <FaRocket /> Trusted by 500+ Companies
          </div>
          <h1>Empower Your Workforce with SkillSync</h1>
          <p className="hero-subtitle">
            The complete solution for tracking employee skills, managing
            departments, and optimizing your organization's talent.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number"><AnimatedCounter end={500} /></div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat-item">
              <div className="stat-number"><AnimatedCounter end={10000} /></div>
              <div className="stat-label">Employees</div>
            </div>
            <div className="stat-item">
              <div className="stat-number"><AnimatedCounter end={98} /></div>
              <div className="stat-label">Satisfaction %</div>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/login" className="btn primary">
              Get Started <FaArrowRight />
            </Link>
            <button className="btn secondary">
              <FaPlay /> Watch Demo
            </button>
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
        <div className="section-header">
          <h2>Why Choose SkillSync?</h2>
          <p>Discover what makes us the preferred choice for modern organizations</p>
        </div>
        <div className="features-grid">
          <div className="feature-card glass hover-lift">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>Comprehensive Analytics</h3>
            <p>
              Gain insights into your workforce capabilities with powerful
              reporting and visualization tools.
            </p>
            <div className="feature-highlight">Real-time dashboards</div>
          </div>

          <div className="feature-card glass hover-lift">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Employee Management</h3>
            <p>
              Easily track and manage employee information, departments, and
              reporting structures.
            </p>
            <div className="feature-highlight">One-click updates</div>
          </div>

          <div className="feature-card glass hover-lift">
            <div className="feature-icon">
              <FaTools />
            </div>
            <h3>Skill Tracking</h3>
            <p>
              Maintain a complete inventory of employee skills and competencies
              across your organization.
            </p>
            <div className="feature-highlight">Smart recommendations</div>
          </div>

          <div className="feature-card glass hover-lift">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3>Secure Access</h3>
            <p>
              Role-based access control ensures data security while providing
              appropriate access levels.
            </p>
            <div className="feature-highlight">Enterprise-grade security</div>
          </div>

          <div className="feature-card glass hover-lift">
            <div className="feature-icon">
              <FaChartPie />
            </div>
            <h3>Interactive Reports</h3>
            <p>
              Generate and visualize performance reports with interactive charts
              for better decision-making.
            </p>
            <div className="feature-highlight">Custom dashboards</div>
          </div>

          <div className="feature-card glass hover-lift">
            <div className="feature-icon">
              <FaSortAmountUpAlt />
            </div>
            <h3>Smart Sorting & Filters</h3>
            <p>
              Quickly find employees, departments, or skills with advanced
              sorting and filtering tools.
            </p>
            <div className="feature-highlight">Instant search</div>
          </div>
        </div>
      </section>

      <section className="testimonials-section glass">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p>Join hundreds of satisfied organizations</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </section>

      <section className="landing-cta glass">
        <div className="cta-content">
          <div className="cta-badge">
            <FaStar /> Limited Time Offer
          </div>
          <h2>Ready to Transform Your Workforce Management?</h2>
          <p>
            Join hundreds of organizations that trust SkillSync for their
            employee development and talent management needs.
          </p>
          <div className="cta-features">
            <span className="cta-feature">✓ 14-day free trial</span>
            <span className="cta-feature">✓ No credit card required</span>
            <span className="cta-feature">✓ Full access to all features</span>
          </div>
          <Link to="/signup" className="btn primary large">
            <FaRocket /> Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
