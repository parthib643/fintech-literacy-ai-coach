import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // update here this with  backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication endpoints
export const register = async (userData) => {
    console.log("Sending register data:", userData);  // Frontend log
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error("Register API error:", error);
    throw error.response?.data || error.message;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add token to headers for authenticated requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;