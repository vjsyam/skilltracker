import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaLinkedin, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import "../styles/auth.css";
import FloatingParticles from "../components/FloatingParticles";

// Password Strength Indicator Component
function PasswordStrengthIndicator({ password }) {
  const getStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['#ff4444', '#ff8800', '#ffbb33', '#00C851', '#007E33'];

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="strength-bars">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`strength-bar ${level <= strength ? 'active' : ''}`}
            style={{ backgroundColor: level <= strength ? strengthColor[strength - 1] : '#e0e0e0' }}
          />
        ))}
      </div>
      <span className="strength-text" style={{ color: strengthColor[strength - 1] }}>
        {strengthText[strength - 1]}
      </span>
    </div>
  );
}

// Social Login Button Component
function SocialLoginButton({ provider, icon, text, onClick }) {
  return (
    <button type="button" className="social-login-btn" onClick={onClick}>
      {icon}
      <span>{text}</span>
    </button>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setIsFormValid(formData.email && formData.password.length >= 6);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError("");

    try {
      await authService.login(formData.email, formData.password);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // This is just visual - in a real app, you'd implement OAuth
    setError(`${provider} login is not implemented in this demo. Please use email/password.`);
  };

  return (
    <div className="auth-page">
      <FloatingParticles />
      <div className="auth-wrapper">
        <div className={`auth-container glass ${isVisible ? 'slide-in' : ''}`}>
          <div className="auth-header">
            <div className="welcome-back">
              <h2>Welcome Back!</h2>
              <p>We're excited to see you again</p>
            </div>
          </div>

          {error && (
            <div className="auth-error shake">
              <FaTimes className="error-icon" />
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className={formData.email ? 'has-value' : ''}
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={formData.password ? 'has-value' : ''}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`auth-btn primary ${isFormValid ? 'valid' : 'invalid'}`} 
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  <FaCheck className="check-icon" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <SocialLoginButton
              provider="Google"
              icon={<FaGoogle />}
              text="Google"
              onClick={() => handleSocialLogin('Google')}
            />
            <SocialLoginButton
              provider="GitHub"
              icon={<FaGithub />}
              text="GitHub"
              onClick={() => handleSocialLogin('GitHub')}
            />
            <SocialLoginButton
              provider="LinkedIn"
              icon={<FaLinkedin />}
              text="LinkedIn"
              onClick={() => handleSocialLogin('LinkedIn')}
            />
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup" className="link-highlight">Sign Up</Link>
            </p>
          </div>
        </div>

        <div className="auth-side">
          <div className="side-content">
            <h2>Welcome Back!</h2>
            <p>Sign in to access your SkillSync dashboard and continue managing your workforce effectively.</p>
            <div className="auth-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <h4>Access Employee Data</h4>
                  <p>View and manage all employee information</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <h4>Generate Reports</h4>
                  <p>Create comprehensive analytics reports</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <div>
                  <h4>Manage Departments</h4>
                  <p>Organize teams and assignments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}