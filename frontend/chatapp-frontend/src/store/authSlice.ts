import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/auth';

interface AuthState {
  user: {
    id: number;
    email: string;
    username: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, setLoading, setError, logout } = authSlice.actions;

export const login = (credentials: { email: string; password: string }) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await authApi.login(credentials);
    dispatch(setUser(response.user));
    dispatch(setToken(response.token));
    localStorage.setItem('token', response.token);
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Login failed'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const register = (data: { username: string; password: string; email?: string }) => async (dispatch: any) => {
  try {
    const response = await authApi.register(data);
    dispatch(setToken(response.token));
    dispatch(setUser(response.user));
  } catch (error: any) {
    dispatch(setError(error.response?.data?.message || 'Registration failed'));
  }
};

export default authSlice.reducer; 