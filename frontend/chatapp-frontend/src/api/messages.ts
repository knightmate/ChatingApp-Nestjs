import axios from 'axios';

const API_URL = 'https://lions-psychiatry-till-mood.trycloudflare.com';

// Clean Axios setup
axios.defaults.headers.common['Accept'] = 'application/json';

// Include token automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
  isRead: boolean;
}

export const getMessages = async (otherUserId: number): Promise<Message[]> => {
  const response = await axios.get(`${API_URL}/messages/chat/${otherUserId}`);
  return response.data;
};

export const getLatestMessages = async (otherUserId: number, lastMessageId?: number): Promise<Message[]> => {
  const url = lastMessageId 
    ? `${API_URL}/messages/chat/${otherUserId}?after=${lastMessageId}`
    : `${API_URL}/messages/chat/${otherUserId}`;
  const response = await axios.get(url);
  return response.data;
};

export const sendMessage = async (receiverId: number, content: string): Promise<Message> => {
  const response = await axios.post(`${API_URL}/messages/send`, {
    receiverId,
    content,
  });
  return response.data;
};

export const getUnreadMessages = async (): Promise<Message[]> => {
  const response = await axios.get(`${API_URL}/messages/unread`);
  return response.data;
};

export const markMessagesAsRead = async (messageIds: number[]): Promise<void> => {
  await axios.post(`${API_URL}/messages/read`, { messageIds });
};
