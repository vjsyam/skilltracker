const API_BASE_URL = "http://localhost:8080/api/auth";

export const authService = {
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

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    }

    return data;
  },

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

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    }

    return data;
  },

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true" && !!localStorage.getItem("token");
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "ADMIN";
  },

  isEmployee() {
    const user = this.getCurrentUser();
    return user && user.role === "EMPLOYEE";
  },

  getToken() {
    return localStorage.getItem("token");
  },

  hasToken() {
    return !!localStorage.getItem("token");
  }
};