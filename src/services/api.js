import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const forgotPassword = (data) => API.post("/auth/forgot-password", data);


// NIDA & NESA
export const getNIDAProfile = (nationalId) => API.get(`/nida/${nationalId}`);
export const getNESARecord = (studentId, nationalId) => API.get(`/nesa/${studentId}?nationalId=${nationalId}`);

// Applications
export const submitApplication = (data) => API.post('/applications', data);
export const getMyApplication = () => API.get('/applications/my-application');
export const getAllApplications = () => API.get('/applications');
export const getApplicationById = (id) => API.get(`/applications/${id}`);
export const reviewApplication = (id, data) => API.patch(`/applications/${id}/review`, data);

// Users
export const getAllUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const createUser = (data) => API.post('/users', data);
export const updateUser = (id, data) => API.patch(`/users/${id}`, data);
export const toggleUserStatus = (id) => API.patch(`/users/${id}/toggle-status`);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Dashboard
export const getDashboardStats = () => API.get('/dashboard');

export default API;