import axios from 'axios';
import type { LoginRequest, LoginResponse } from '../types';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.is_admin || false;
  },
};

export const aboutService = {
  getAll: () => api.get('/about'),
  create: (data: any) => api.post('/about', data),
  update: (id: number, data: any) => api.put(`/about/${id}`, data),
  delete: (id: number) => api.delete(`/about/${id}`),
};

export const resumeService = {
  getAll: () => api.get('/resume'),
  create: (data: any) => api.post('/resume', data),
  update: (id: number, data: any) => api.put(`/resume/${id}`, data),
  delete: (id: number) => api.delete(`/resume/${id}`),
};

export const carBuildService = {
  getAll: () => api.get('/carbuild'),
  create: (data: any) => api.post('/carbuild', data),
  update: (id: number, data: any) => api.put(`/carbuild/${id}`, data),
  delete: (id: number) => api.delete(`/carbuild/${id}`),
};

export const contactService = {
  submit: (data: any) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  delete: (id: number) => api.delete(`/contact/${id}`),
};

export default api;
