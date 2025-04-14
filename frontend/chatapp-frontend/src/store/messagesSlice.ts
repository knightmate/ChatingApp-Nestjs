import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { messagesApi, Message } from '../api/messages';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
  isRead: boolean;
}

interface MessagesState {
  messages: Message[];
  currentChat: number | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  currentChat: null,
  unreadCount: 0,
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setCurrentChat: (state, action: PayloadAction<number>) => {
      state.currentChat = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setMessages, addMessage, setCurrentChat, setUnreadCount, setError } = messagesSlice.actions;

export const fetchMessages = (userId: number) => async (dispatch: any) => {
  try {
    const messages = await messagesApi.getMessages(userId);
    dispatch(setMessages(messages));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch messages'));
  }
};

export const sendNewMessage = (receiverId: number, content: string) => async (dispatch: any) => {
  try {
    const message = await messagesApi.sendMessage(receiverId, content);
    dispatch(addMessage(message));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to send message'));
  }
};

export const fetchUnreadMessages = () => async (dispatch: any) => {
  try {
    const messages = await messagesApi.getUnreadMessages();
    dispatch(setUnreadCount(messages.length));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch unread messages'));
  }
};

export const markMessagesRead = (messageIds: number[]) => async (dispatch: any) => {
  try {
    await messagesApi.markAsRead(messageIds);
    dispatch(setUnreadCount(0));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to mark messages as read'));
  }
};

export default messagesSlice.reducer; 