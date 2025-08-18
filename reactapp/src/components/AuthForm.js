// import React, { useState } from "react";
// import { FaUser, FaLock, FaEnvelope, FaSignInAlt, FaUserPlus } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import "../styles/auth.css";

// // Base API URL (for easier environment management)
// const API_BASE_URL = "http://localhost:8080/api/auth";

// export function LoginForm({ onLogin }) {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(credentials),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Login failed. Please try again.");
//       }

//       onLogin(data.token, data.user);  // Handle success (stores token + user data)
//       navigate("/home");  // Redirect to dashboard after login
//     } catch (err) {
//       setError(err.message || "An error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container glass">
//       <div className="auth-header">
//         <h2><FaSignInAlt /> Login</h2>
//         <p>Welcome back! Please enter your credentials.</p>
//       </div>
      
//       {error && <div className="auth-error">{error}</div>}
      
//       <form onSubmit={handleSubmit} className="auth-form">
//         <div className="form-group">
//           <label htmlFor="email"><FaEnvelope /> Email</label>
//           <input
//             type="email"
//             id="email"
//             value={credentials.email}
//             onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="password"><FaLock /> Password</label>
//           <input
//             type="password"
//             id="password"
//             value={credentials.password}
//             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//             required
//           />
//         </div>
        
//         <button type="submit" className="auth-btn primary" disabled={isLoading}>
//           {isLoading ? "Loading..." : <><FaSignInAlt /> Login</>}
//         </button>
//       </form>
//     </div>
//   );
// }

// export function SignupForm({ onSignup }) {
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     if (userData.password !== userData.confirmPassword) {
//       setError("Passwords do not match!");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: userData.name,
//           email: userData.email,
//           password: userData.password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Signup failed. Please try again.");
//       }

//       onSignup(data.token, data.user);  // Handle success
//       navigate("/home");  // Redirect to dashboard after signup
//     } catch (err) {
//       setError(err.message || "An error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container glass">
//       <div className="auth-header">
//         <h2><FaUserPlus /> Sign Up</h2>
//         <p>Create a new account to get started.</p>
//       </div>
      
//       {error && <div className="auth-error">{error}</div>}
      
//       <form onSubmit={handleSubmit} className="auth-form">
//         <div className="form-group">
//           <label htmlFor="name"><FaUser /> Full Name</label>
//           <input
//             type="text"
//             id="name"
//             value={userData.name}
//             onChange={(e) => setUserData({ ...userData, name: e.target.value })}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="email"><FaEnvelope /> Email</label>
//           <input
//             type="email"
//             id="email"
//             value={userData.email}
//             onChange={(e) => setUserData({ ...userData, email: e.target.value })}
//             required
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="password"><FaLock /> Password</label>
//           <input
//             type="password"
//             id="password"
//             value={userData.password}
//             onChange={(e) => setUserData({ ...userData, password: e.target.value })}
//             required
//             minLength="6"
//           />
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="confirmPassword"><FaLock /> Confirm Password</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             value={userData.confirmPassword}
//             onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
//             required
//           />
//         </div>
        
//         <button type="submit" className="auth-btn primary" disabled={isLoading}>
//           {isLoading ? "Loading..." : <><FaUserPlus /> Sign Up</>}
//         </button>
//       </form>
//     </div>
//   );
// }