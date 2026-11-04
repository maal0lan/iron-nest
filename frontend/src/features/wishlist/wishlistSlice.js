import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/wishlist');
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to load wishlist' });
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async ({ productId }, { rejectWithValue }) => {
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
  items: [],
  status: 'idle',
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.ids = action.payload.map((p) => p._id || p);
        state.items = action.payload.filter((p) => typeof p === 'object');
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to load wishlist';
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.ids = action.payload.wishlist.map((p) => p._id || p);
        const product = action.meta.arg.product;
        if (product && !state.items.some((item) => item._id === product._id)) {
          state.items.push(product);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.ids = action.payload.wishlist.map((p) => p._id || p);
        state.items = state.items.filter((item) => state.ids.includes(item._id));
      });
  },
});

export default wishlistSlice.reducer;
