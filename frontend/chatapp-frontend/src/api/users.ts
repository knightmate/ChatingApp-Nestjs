import axios from 'axios';

const API_URL = 'https://lions-psychiatry-till-mood.trycloudflare.com';

// Configure axios defaults
axios.defaults.withCredentials = false; // ✅ Only set true if using cookies
axios.defaults.headers.common['Accept'] = 'application/json';

// Auth token injection
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  username: string;
}

export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};
