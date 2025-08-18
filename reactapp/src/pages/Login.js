import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-container glass">
          <div className="auth-header">
            <h2>Login</h2>
            <p>Welcome back! Please login to continue.</p>
          </div>

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
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-btn primary">
              Login
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