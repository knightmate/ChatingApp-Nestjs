import axiosInstance from './axiosConfig';

export interface User {
  id: number;
  username: string;
}

export const searchUsers = async (query: string): Promise<User[]> => {
  const response = await axiosInstance.get(`/users/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get(`/users`);
  return response.data;
};
