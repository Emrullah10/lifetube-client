import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Export base URL for components that need it (e.g., for thumbnail URLs)
export const API_BASE_URL = API_URL.replace('/api', '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Videos API
export const videosAPI = {
  getAll: (params) => api.get('/videos', { params }),
  getById: (id) => api.get(`/videos/${id}`),
  getTrending: () => api.get('/videos/trending'),
  upload: (formData) => api.post('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  incrementView: (id) => api.post(`/videos/${id}/view`),
  like: (id, type) => api.post(`/videos/${id}/like`, { type }),
  delete: (id) => api.delete(`/videos/${id}`)
};

// Comments API
export const commentsAPI = {
  getByVideo: (videoId) => api.get(`/comments/video/${videoId}`),
  add: (data) => api.post('/comments', data),
  delete: (id) => api.delete(`/comments/${id}`)
};

// Users API
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  subscribe: (channelId) => api.post('/users/subscribe', { channelId }),
  getSubscriptions: () => api.get('/users/subscriptions/list'),
  getSubscriptionFeed: () => api.get('/users/subscriptions/feed'),
  checkSubscription: (channelId) => api.get(`/users/subscriptions/check/${channelId}`)
};

export default api;
