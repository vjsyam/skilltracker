import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Skills from "./pages/Skills";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";

// ✅ Layout wrapper to handle navbar/footer visibility
function Layout({ children }) {
  const location = useLocation();
  const hideNavAndFooter = ["/", "/login", "/signup"].includes(location.pathname);

  return (
    <div className="app">
      {!hideNavAndFooter && <Navbar />}
      <div className={hideNavAndFooter ? "page-full" : "main-content"}>
        {children}
      </div>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Pages */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;



// import React, { useState, createContext, useContext } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Employees from "./pages/Employees";
// import Departments from "./pages/Departments";
// import Skills from "./pages/Skills";
// import Reports from "./pages/Reports";
// import Messages from "./pages/Messages";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import "./styles/auth.css";
// import "./styles/landing.css";

// // Create Auth Context
// const AuthContext = createContext();

// function App() {
//   const [user, setUser] = useState(null);

//   const handleLogin = (token, userData) => {
//     localStorage.setItem('token', token);
//     setUser(userData);
//   };

//   const handleSignup = (token, userData) => {
//     localStorage.setItem('token', token);
//     setUser(userData);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     return <Navigate to="/" />;
//   };

//   return (
//     <AuthContext.Provider value={{ user, handleLogout }}>
//       <Router>
//         <div className="app">
//           {user && <Navbar />} {/* Only show navbar when logged in */}
//           <div className="main-content">
//             <Routes>
//               {/* Public routes */}
//               <Route path="/" element={user ? <Navigate to="/home" /> : <Landing />} />
//               <Route 
//                 path="/login" 
//                 element={user ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} 
//               />
//               <Route 
//                 path="/signup" 
//                 element={user ? <Navigate to="/home" /> : <Signup onSignup={handleSignup} />} 
//               />
              
//               {/* Protected routes */}
//               <Route 
//                 path="/home" 
//                 element={user ? <Home /> : <Navigate to="/login" />} 
//               />
//               <Route 
//                 path="/employees" 
//                 element={user ? <Employees /> : <Navigate to="/login" />} 
//               />
//               <Route 
//                 path="/departments" 
//                 element={user ? <Departments /> : <Navigate to="/login" />} 
//               />
//               <Route 
//                 path="/skills" 
//                 element={user ? <Skills /> : <Navigate to="/login" />} 
//               />
//               <Route 
//                 path="/reports" 
//                 element={user ? <Reports /> : <Navigate to="/login" />} 
//               />
//               <Route 
//                 path="/messages" 
//                 element={user ? <Messages /> : <Navigate to="/login" />} 
//               />
//             </Routes>
//           </div>
//           {user && <Footer />}
//         </div>
//       </Router>
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// export default App;