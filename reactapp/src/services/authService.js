const API_BASE_URL = "http://localhost:8080/api/auth";

export const authService = {
  // Login user
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  // Signup user
  async signup(name, email, password, role) {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role: role.toUpperCase() }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  },

  // Logout user
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  },

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "ADMIN";
  },

  // Check if user is employee
  isEmployee() {
    const user = this.getCurrentUser();
    return user && user.role === "EMPLOYEE";
  }
};
