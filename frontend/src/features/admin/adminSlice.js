import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const fetchAdminStats = createAsyncThunk('admin/fetchAdminStats', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/admin/stats');
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to load stats' });
  }
});

export const fetchAdminSellers = createAsyncThunk('admin/fetchAdminSellers', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/admin/sellers');
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to load sellers' });
  }
});

const initialState = {
  stats: null,
  sellers: [],
  status: 'idle',
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAdminSellers.fulfilled, (state, action) => {
        state.sellers = action.payload;
      });
  },
});

export default adminSlice.reducer;
