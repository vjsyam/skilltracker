import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.login(formData.email, formData.password);
      
      // authService.login already sets localStorage values, no need to set them again
      // Login successful
      
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-container glass">
          <div className="auth-header">
            <h2>Login</h2>
            <p>Welcome back! Please login to continue.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
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

            </div>
            <button type="submit" className="auth-btn primary" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>

        <div className="auth-side">
          <h2>Welcome Back!</h2>
          <p>Sign in to access your SkillSync dashboard.</p>
          <div className="auth-benefits">
            <div className="benefit-item">✓ Access employee data</div>
            <div className="benefit-item">✓ Generate reports</div>
            <div className="benefit-item">✓ Manage departments</div>
          </div>
        </div>
      </div>
    </div>
  );
}


// // src/pages/Login.js
// import React from "react";
// import { LoginForm } from "../components/AuthForm";
// import "../styles/auth.css";

// export default function Login({ onLogin }) {
//   return (
//     <div className="auth-page">
//       <div className="auth-wrapper">
//         <LoginForm onLogin={onLogin} />
//         <div className="auth-side glass">
//           <h2>Welcome Back!</h2>
//           <p>
//             Sign in to access your SkillSync dashboard and continue managing 
//             your workforce effectively.
//           </p>
//           <div className="auth-benefits">
//             <div className="benefit-item">
//               <span>✓</span> Access all employee data
//             </div>
//             <div className="benefit-item">
//               <span>✓</span> Generate reports
//             </div>
//             <div className="benefit-item">
//               <span>✓</span> Manage departments
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }