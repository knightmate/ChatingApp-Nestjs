import axios from 'axios';

const API_URL = 'https://lions-psychiatry-till-mood.trycloudflare.com';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Add a request interceptor to include the auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  config.headers.Accept = 'application/json';
  return config;
});

interface LoginResponse {
  token: string;
  userInfo: {
    id: number;
    username: string;
    email: string | null;
    createdAt: string;
  };
}

interface AuthError {
  message: string;
  statusCode: number;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });
  // Store token and user info in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
  return response.data;
};

export const register = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    username,
    password,
  });
  // Store token and user info in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
};

export const authApi = {
  getCurrentUser: async (): Promise<LoginResponse['userInfo']> => {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  },
}; 