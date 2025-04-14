import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { friendsApi, Friend } from '../api/friends';

interface FriendsState {
  friends: Friend[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  loading: false,
  error: null,
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.friends.push(action.payload);
    },
    removeFriend: (state, action: PayloadAction<number>) => {
      state.friends = state.friends.filter(friend => friend.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setFriends, addFriend, removeFriend, setError } = friendsSlice.actions;

export const fetchFriends = () => async (dispatch: any) => {
  try {
    const friends = await friendsApi.getFriends();
    dispatch(setFriends(friends));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch friends'));
  }
};

export const addNewFriend = (friendId: number) => async (dispatch: any) => {
  try {
    const friend = await friendsApi.addFriend(friendId);
    dispatch(addFriend(friend));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to add friend'));
  }
};

export const removeExistingFriend = (friendId: number) => async (dispatch: any) => {
  try {
    await friendsApi.removeFriend(friendId);
    dispatch(removeFriend(friendId));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Failed to remove friend'));
  }
};

export default friendsSlice.reducer; 