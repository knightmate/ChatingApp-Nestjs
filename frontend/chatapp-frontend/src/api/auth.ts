import axiosInstance from './axiosConfig';



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
    
  const response = await axiosInstance.post('/auth/login', {
    username,
    password,
  });
   
  console.log('axiosInstance',response)
  console.log("response",username,password)
  // Store token and user info in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
  return response.data;
};

export const register = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/register', {
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
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
}; 