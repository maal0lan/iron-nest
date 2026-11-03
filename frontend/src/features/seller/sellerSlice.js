import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const fetchSellerProducts = createAsyncThunk('seller/fetchSellerProducts', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/seller/products');
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to load products' });
  }
});

export const createSellerProduct = createAsyncThunk('seller/createSellerProduct', async (productData, { rejectWithValue }) => {
  try {
    return await api.post('/products', productData);
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to create product' });
  }
});

export const updateSellerProduct = createAsyncThunk('seller/updateSellerProduct', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await api.patch(`/products/${id}`, data);
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to update product' });
  }
});

export const deleteSellerProduct = createAsyncThunk('seller/deleteSellerProduct', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to delete product' });
  }
});

export const updateSellerStock = createAsyncThunk('seller/updateSellerStock', async ({ id, stock }, { rejectWithValue }) => {
  try {
    return await api.patch(`/products/${id}/stock`, { stock });
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to update stock' });
  }
});

export const fetchSellerOrders = createAsyncThunk('seller/fetchSellerOrders', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/seller/orders');
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to load orders' });
  }
});

export const updateOrderStatus = createAsyncThunk('seller/updateOrderStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    return await api.patch(`/seller/orders/${id}/status`, { status });
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to update status' });
  }
});

export const fetchSellerStats = createAsyncThunk('seller/fetchSellerStats', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/seller/stats');
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to load stats' });
  }
});

const initialState = {
  products: [],
  orders: [],
  stats: null,
  status: 'idle',
  error: null,
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createSellerProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateSellerProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) => (p._id === action.payload._id ? action.payload : p));
      })
      .addCase(deleteSellerProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(updateSellerStock.fulfilled, (state, action) => {
        state.products = state.products.map((p) => (p._id === action.payload._id ? action.payload : p));
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((o) => (o._id === action.payload._id ? action.payload : o));
      })
      .addCase(fetchSellerStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default sellerSlice.reducer;
