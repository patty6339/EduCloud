import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

// Course APIs
export const getStudentCourses = async () => {
  const { data } = await api.get('/courses');
  return data;
};

export const getCourseDetails = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}`);
  return data;
};

export default api;
