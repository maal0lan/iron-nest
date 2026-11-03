import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/wishlist');
  } catch (err) {
    return rejectWithValue([]);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, { rejectWithValue }) => {
  try {
    return await api.post(`/wishlist/${productId}`);
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to add to wishlist' });
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, { rejectWithValue }) => {
  try {
    return await api.delete(`/wishlist/${productId}`);
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to remove from wishlist' });
  }
});

const initialState = {
  ids: [],
  status: 'idle',
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.ids = action.payload.map((p) => p._id || p);
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.ids = action.payload.wishlist.map((p) => p._id || p);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.ids = action.payload.wishlist.map((p) => p._id || p);
      });
  },
});

export default wishlistSlice.reducer;
