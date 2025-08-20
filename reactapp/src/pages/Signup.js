import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    role: "employee" 
  });

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
      const data = await authService.signup(formData.name, formData.email, formData.password, formData.role);
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");
      
      navigate("/home");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-container glass">
          <div className="auth-header">
            <h2>Sign Up</h2>
            <p>Create your account to get started.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
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
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="role-select"
                required
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="auth-btn primary" disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>

        <div className="auth-side">
          <h2>Join SkillSync Today</h2>
          <p>Start optimizing your workforce management in minutes.</p>
          <div className="auth-benefits">
            <div className="benefit-item">✓ Free trial</div>
            <div className="benefit-item">✓ No credit card required</div>
            <div className="benefit-item">✓ Cancel anytime</div>
          </div>
        </div>
      </div>
    </div>
  );
}


// // src/pages/Signup.js
// import React from "react";
// import { SignupForm } from "../components/AuthForm";
// import "../styles/auth.css";

// export default function Signup({ onSignup }) {
//   return (
//     <div className="auth-page">
//       <div className="auth-wrapper">
//         <SignupForm onSignup={onSignup} />
//         <div className="auth-side glass">
//           <h2>Join SkillSync Today</h2>
//           <p>
//             Create your account and start optimizing your workforce management 
//             in minutes.
//           </p>
//           <div className="auth-benefits">
//             <div className="benefit-item">
//               <span>✓</span> Free 14-day trial
//             </div>
//             <div className="benefit-item">
//               <span>✓</span> No credit card required
//             </div>
//             <div className="benefit-item">
//               <span>✓</span> Cancel anytime
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }