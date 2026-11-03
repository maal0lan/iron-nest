import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

const loadUser = () => {
  try {
    const raw = localStorage.getItem('ironnest_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const loadToken = () => {
  try {
    return localStorage.getItem('ironnest_token');
  } catch { return null; }
};

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('ironnest_token', data.token);
    localStorage.setItem('ironnest_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Login failed' });
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await api.post('/auth/register', userData);
    localStorage.setItem('ironnest_token', data.token);
    localStorage.setItem('ironnest_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Registration failed' });
  }
});

export const loadMe = createAsyncThunk('auth/loadMe', async (_, { rejectWithValue }) => {
  const token = loadToken();
  if (!token) return rejectWithValue({ message: 'No token' });
  try {
    const data = await api.get('/auth/me');
    localStorage.setItem('ironnest_user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    localStorage.removeItem('ironnest_token');
    localStorage.removeItem('ironnest_user');
    return rejectWithValue(err.data || { message: 'Session invalid' });
  }
});

const initialState = {
  user: loadUser(),
  token: loadToken(),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('ironnest_token');
      localStorage.removeItem('ironnest_user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(register.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(loadMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(loadMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export const selectToken = (state) => state.auth.token;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
