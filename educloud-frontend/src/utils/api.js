import axios from 'axios';

const API_BASE = 'https://api.educloud.com';

export const login = async (credentials) => {
  const { data } = await axios.post(`${API_BASE}/auth/login`, credentials);
  return data;
};

export const getStudentCourses = async () => {
  const { data } = await axios.get(`${API_BASE}/courses`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data;
};
