import axios from 'axios';

// from chat
// Base API configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8888';
const apiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true, // Important for cookies/sessions if you use them
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (helpful for debugging)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      
      // Handle 401 Unauthorized (token expired or not logged in)
      if (error.response.status === 401) {
        // You might want to redirect to login or refresh token
        console.log('Authentication required');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

