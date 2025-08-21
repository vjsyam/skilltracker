import { authService } from './authService';

const API_BASE_URL = "http://localhost:8080/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = authService.getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('Auth headers:', headers);
  return headers;
};

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  console.log(`API Call: ${url}`, config);

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log('Authentication failed, redirecting to login');
        authService.logout();
        window.location.href = '/login';
        throw new Error('Authentication failed. Please login again.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API Response: ${url}`, data);
    return data;
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
};

// GET request
export const apiGet = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return apiCall(url);
};

// POST request
export const apiPost = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request
export const apiPut = (endpoint, data) => {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const apiDelete = (endpoint) => {
  return apiCall(endpoint, {
    method: 'DELETE',
  });
};