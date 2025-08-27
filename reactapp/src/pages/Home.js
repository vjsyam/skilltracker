import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";
import { sendMessage } from "../services/messageService";
import { getReports } from "../services/reportsService";
import { 
  FaUserFriends,
  FaUserGraduate, 
  FaChartBar,
  FaUserTie,
  FaClipboardCheck,
  FaChartPie,
  FaIdBadge,
  FaEnvelope,
  FaBell,
  FaClock,
  FaStar,
  FaChartLine,
  FaUsers,
  FaLightbulb,
  FaRocket
} from "react-icons/fa";
import { authService } from "../services/authService";
import FloatingParticles from "../components/FloatingParticles";
import Footer from "../components/Footer";
import { getEmployees } from "../services/employeeService";
import { fetchEmployeeSkillsByEmployee } from "../services/employeeSkillLinkService";

// Welcome Animation Component
function WelcomeAnimation({ userName, isVisible }) {
  return (
    <div className={`welcome-animation ${isVisible ? 'visible' : ''}`}>
      <div className="welcome-content">
        <h1 className="welcome-text">
          Welcome back, <span className="highlight">{userName}</span>! 👋
        </h1>
        <div className="welcome-subtitle">
          Ready to make today productive?
        </div>
      </div>
    </div>
  );
}

// Quick Stats Component
function QuickStats({ isAdmin, reportData, employeeStats }) {
  const stats = isAdmin ? [
    { icon: <FaUsers />, label: "Total Employees", value: reportData?.totalEmployees || "0", trend: "Live", color: "#FF6B6B" },
    { icon: <FaClipboardCheck />, label: "Active Skills", value: reportData?.totalSkills || "0", trend: "Live", color: "#FF9F9F" },
    { icon: <FaChartPie />, label: "Departments", value: reportData?.totalDepartments || "0", trend: "Live", color: "#FFD93D" },
    { icon: <FaChartLine />, label: "Growth Rate", value: "23%", trend: "+8%", color: "#00C851" }
  ] : [
    { icon: <FaStar />, label: "My Skills", value: String(employeeStats?.profileSkills ?? 0), trend: "Live", color: "#FF6B6B" },
    { icon: <FaLightbulb />, label: "Learning", value: String(employeeStats?.ongoing ?? 0), trend: "Active", color: "#FF9F9F" },
    { icon: <FaChartBar />, label: "Progress", value: `${employeeStats?.avgProgress ?? 0}%`, trend: "Live", color: "#FFD93D" }
  ];

  return (
    <div className="quick-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card glass" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="stat-icon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-trend" style={{ color: stat.color }}>
              {stat.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Recent Activity Component
function RecentActivity({ isAdmin }) {
  const activities = isAdmin ? [
    { type: "employee", message: "New employee added", time: "2 minutes ago", icon: <FaUserTie /> },
    { type: "skill", message: "Skill catalog updated", time: "15 minutes ago", icon: <FaClipboardCheck /> },
    { type: "report", message: "Monthly report generated", time: "1 hour ago", icon: <FaChartPie /> },
    { type: "message", message: "New message received", time: "2 hours ago", icon: <FaEnvelope /> }
  ] : [
    { type: "skill", message: "Learning in progress", time: "1 hour ago", icon: <FaStar /> },
    { type: "learning", message: "Completed a module", time: "3 hours ago", icon: <FaLightbulb /> },
    { type: "goal", message: "Progress increased", time: "1 day ago", icon: <FaRocket /> },
    { type: "feedback", message: "New feedback available", time: "2 days ago", icon: <FaBell /> }
  ];

  return (
    <div className="recent-activity glass">
      <div className="activity-header">
        <h3><FaClock /> Recent Activity</h3>
        <span className="activity-count">{activities.length} updates</span>
      </div>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="activity-icon">
              {activity.icon}
            </div>
            <div className="activity-content">
              <div className="activity-message">{activity.message}</div>
              <div className="activity-time">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Status Indicator Component
function StatusIndicator({ status = "online" }) {
  const statusConfig = {
    online: { color: "#00C851", text: "System Online", icon: "🟢" },
    maintenance: { color: "#FF8800", text: "Maintenance Mode", icon: "🟡" },
    offline: { color: "#ff4444", text: "System Offline", icon: "🔴" }
  };

  const config = statusConfig[status];

  return (
    <div className="status-indicator" style={{ color: config.color }}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-text">{config.text}</span>
    </div>
  );
}

export default function Homepage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: ""
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [employeeStats, setEmployeeStats] = useState({ profileSkills: 0, ongoing: 0, avgProgress: 0, goals: 0 });
  const [showFooter, setShowFooter] = useState(false);

  const user = useMemo(() => authService.getCurrentUser(), []);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      const viewport = window.innerHeight;
      const full = document.documentElement.scrollHeight;
      const nearBottom = scrolled + viewport >= full - 80; // near bottom
      setShowFooter(nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReports();
        let data = null;
        if (response && response.data) {
          data = response.data;
        } else if (response && response.content) {
          data = response.content;
        } else if (response) {
          data = response;
        }
        
        if (data) {
          // Calculate totals from the data
          const totalEmployees = Object.values(data.employeesPerDepartment || {}).reduce((sum, count) => sum + count, 0);
          const totalSkills = Object.values(data.skillsCount || {}).reduce((sum, count) => sum + count, 0);
          const totalDepartments = Object.keys(data.employeesPerDepartment || {}).length;
          
          setReportData({
            ...data,
            totalEmployees: totalEmployees.toString(),
            totalSkills: totalSkills.toString(),
            totalDepartments: totalDepartments.toString()
          });
        }
      } catch (err) {
        console.error("Error fetching reports for homepage:", err);
        // Don't show error on homepage, just use default values
      }
    };

    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin]);

  useEffect(() => {
    async function loadEmployeeStats() {
      try {
        const res = await getEmployees(0, 500);
        const employees = res?.content || res?.data || res || [];
        const me = Array.isArray(employees) ? employees.find(e => e.userId === (user?.id || user?.userId)) : null;
        if (!me?.id) return;
        const links = await fetchEmployeeSkillsByEmployee(me.id);
        const profileSkills = Array.isArray(links) ? links.length : 0;
        // Ongoing from local for now
        const ongoingRaw = localStorage.getItem('ongoingSkills');
        const ongoing = ongoingRaw ? JSON.parse(ongoingRaw) : [];
        const avgProgress = ongoing.length > 0 ? Math.round(ongoing.reduce((a, s) => a + (s.progress || 0), 0) / ongoing.length) : 0;
        setEmployeeStats({ profileSkills, ongoing: ongoing.length, avgProgress, goals: 0 });
      } catch (e) {
        // ignore silently
      }
    }
    if (!isAdmin) loadEmployeeStats();
  }, [isAdmin, user]);

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
      icon: <FaStar />,
      title: "My Profile",
      description: "View your personal information and current skills.",
      link: "/me"
    },
    {
      icon: <FaUserGraduate />,
      title: "New Skills",
      description: "Explore and add new skills to your learning journey.",
      link: "/new-skills"
    }
  ];

  return (
    <div className="homepage">
      <FloatingParticles />
      <WelcomeAnimation userName={user?.name || "User"} isVisible={isVisible} />
      
      <StatusIndicator status="online" />

      <QuickStats isAdmin={isAdmin} reportData={reportData} employeeStats={employeeStats} />

      <div className="homepage-content">
        <section className="primary-features">
          <h2>Core Features</h2>
          <div className="features-grid">
            {primaryFeatures.map((feature, index) => (
              <div key={index} className="feature-card glass hover-lift">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="secondary-features">
          <h2>Explore More Features</h2>
          <div className="features-grid">
            {(isAdmin ? secondaryFeaturesAdmin : secondaryFeaturesEmployee).map((feature, index) => (
              <Link key={index} to={feature.link} className="feature-card glass hover-lift link-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-arrow">→</div>
              </Link>
            ))}
          </div>
        </section>

        <div className="homepage-bottom">
          <RecentActivity isAdmin={isAdmin} />

          <section className="contact-section glass">
            <h2>Get in Touch</h2>
            <p>Have questions or suggestions? We'd love to hear from you!</p>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <textarea
                name="content"
                placeholder="Your message"
                value={formData.content}
                onChange={handleChange}
                required
                rows="4"
              />
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
            {status && <div className="status-message">{status}</div>}
          </section>
        </div>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}