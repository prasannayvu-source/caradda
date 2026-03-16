import axios from 'axios';

const isProd = import.meta.env.PROD;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProd ? '/api/v1' : 'http://localhost:8000/api/v1'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
