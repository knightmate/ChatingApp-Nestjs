 import axiosInstance from './axiosConfig';

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
  const response = await axiosInstance.get(`/friends/list`);
  return response.data;
};

export const getFriendRequests = async (): Promise<FriendRequest[]> => {
  const response = await axiosInstance.get(`/friend-requests/all`);
  return response.data;
};

export const sendFriendRequest = async (receiverId: number): Promise<FriendRequest> => {
  const response = await axiosInstance.post(`/friend-requests/send`, { receiverId });
  return response.data;
};

export const acceptFriendRequest = async (requestId: number): Promise<void> => {
  await axiosInstance.post(`/friend-requests/accept/${requestId}`);
};

export const rejectFriendRequest = async (requestId: number): Promise<void> => {
  await axiosInstance.post(`/friend-requests/reject/${requestId}`);
};

export const removeFriend = async (friendId: number): Promise<void> => {
  await axiosInstance.post(`/friends/remove/${friendId}`);
};
