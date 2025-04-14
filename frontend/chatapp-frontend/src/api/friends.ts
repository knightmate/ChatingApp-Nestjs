import axios from 'axios';

const API_URL = 'https://lions-psychiatry-till-mood.trycloudflare.com';

// Configure axios defaults
axios.defaults.withCredentials = false; // set to true only if you're using cookies
axios.defaults.headers.common['Accept'] = 'application/json';

// Add a request interceptor to include the auth token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Friend {
  id: number;
  username: string;
}

export interface FriendRequest {
  id: number;
  sender: {
    id: number;
    username: string;
  };
  receiver: {
    id: number;
    username: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export const getFriends = async (): Promise<Friend[]> => {
  const response = await axios.get(`${API_URL}/friends/list`);
  return response.data;
};

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  const response = await axios.get(`${API_URL}/friend-requests/all`);
  return response.data;
};

export const sendFriendRequest = async (receiverId: number): Promise<FriendRequest> => {
  const response = await axios.post(`${API_URL}/friend-requests/send`, { receiverId });
  return response.data;
};

export const acceptFriendRequest = async (requestId: number): Promise<void> => {
  await axios.post(`${API_URL}/friend-requests/accept/${requestId}`);
};

export const rejectFriendRequest = async (requestId: number): Promise<void> => {
  await axios.post(`${API_URL}/friend-requests/reject/${requestId}`);
};

export const removeFriend = async (friendId: number): Promise<void> => {
  await axios.post(`${API_URL}/friends/remove/${friendId}`);
};
