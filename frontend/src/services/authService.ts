import axios from 'axios';
import { LoginRequest, RegisterRequest, User } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token from localStorage if it exists
apiClient.interceptors.request.use(
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

export const authService = {
  async login(data: LoginRequest): Promise<User> {
    const response = await apiClient.post<User>('/api/auth/login', data);
    const user = response.data;
    if (user.token) {
      localStorage.setItem('token', user.token);
    }
    // Also save user info in localStorage for instant restore on refresh
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/api/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/api/users/me');
    const user = response.data;
    // Keep local storage in sync
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },
};
