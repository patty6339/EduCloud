import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
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

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify'),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  updatePassword: (token, password) =>
    api.post('/auth/update-password', { token, password }),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.put('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Course API
export const courseAPI = {
  getAllCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  enrollCourse: (id) => api.post(`/courses/${id}/enroll`),
  getCourseProgress: (id) => api.get(`/courses/${id}/progress`),
  submitAssignment: (courseId, assignmentId, data) =>
    api.post(`/courses/${courseId}/assignments/${assignmentId}`, data),
};

// Live Class API
export const liveClassAPI = {
  getAllClasses: () => api.get('/live-classes'),
  getClass: (id) => api.get(`/live-classes/${id}`),
  scheduleClass: (data) => api.post('/live-classes', data),
  updateClass: (id, data) => api.put(`/live-classes/${id}`, data),
  cancelClass: (id) => api.delete(`/live-classes/${id}`),
  joinClass: (id) => api.post(`/live-classes/${id}/join`),
  leaveClass: (id) => api.post(`/live-classes/${id}/leave`),
};

// Assignment API
export const assignmentAPI = {
  getAssignments: (courseId) => api.get(`/courses/${courseId}/assignments`),
  getAssignment: (courseId, assignmentId) =>
    api.get(`/courses/${courseId}/assignments/${assignmentId}`),
  createAssignment: (courseId, data) =>
    api.post(`/courses/${courseId}/assignments`, data),
  updateAssignment: (courseId, assignmentId, data) =>
    api.put(`/courses/${courseId}/assignments/${assignmentId}`, data),
  deleteAssignment: (courseId, assignmentId) =>
    api.delete(`/courses/${courseId}/assignments/${assignmentId}`),
  submitAssignment: (courseId, assignmentId, data) =>
    api.post(`/courses/${courseId}/assignments/${assignmentId}/submit`, data),
  gradeAssignment: (courseId, assignmentId, submissionId, data) =>
    api.post(
      `/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/grade`,
      data
    ),
};

// Chat API
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId) => api.get(`/chat/conversations/${conversationId}`),
  sendMessage: (conversationId, message) =>
    api.post(`/chat/conversations/${conversationId}`, { message }),
  createConversation: (participants) =>
    api.post('/chat/conversations', { participants }),
};

// Analytics API
export const analyticsAPI = {
  getCourseAnalytics: (courseId) => api.get(`/analytics/courses/${courseId}`),
  getStudentAnalytics: (studentId) => api.get(`/analytics/students/${studentId}`),
  getTeacherAnalytics: () => api.get('/analytics/teacher'),
  getPlatformAnalytics: () => api.get('/analytics/platform'),
};

export default api;
