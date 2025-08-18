import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Employees from "./pages/Employees";
import Skills from "./pages/Skills";
import Departments from "./pages/Departments";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";

// Styles
import "./styles/layout.css";
import "./styles/pages.css";
import "./styles/components.css";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ paddingBottom: "60px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
