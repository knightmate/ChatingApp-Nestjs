import axiosInstance from './axiosConfig';


export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
  isRead: boolean;
}

export const getMessages = async (otherUserId: number): Promise<Message[]> => {
  const response = await axiosInstance.get(`/messages/chat/${otherUserId}`);
  return response.data;
};

export const getLatestMessages = async (otherUserId: number, lastMessageId?: number): Promise<Message[]> => {
  const url = lastMessageId 
    ? `/messages/chat/${otherUserId}?after=${lastMessageId}`
    : `/messages/chat/${otherUserId}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

export const sendMessage = async (receiverId: number, content: string): Promise<Message> => {
  const response = await axiosInstance.post(`/messages/send`, {
    receiverId,
    content,
  });
  return response.data;
};

export const getUnreadMessages = async (): Promise<Message[]> => {
  const response = await axiosInstance.get(`/messages/unread`);
  return response.data;
};

export const markMessagesAsRead = async (messageIds: number[]): Promise<void> => {
  await axiosInstance.post(`/messages/read`, { messageIds });
};
