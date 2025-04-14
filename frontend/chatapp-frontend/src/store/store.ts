import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './messagesSlice';
import friendsReducer from './friendsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    messages: messagesReducer,
    friends: friendsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 