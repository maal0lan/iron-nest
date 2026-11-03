import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const placeOrder = createAsyncThunk('orders/placeOrder', async (orderData, { rejectWithValue }) => {
  try {
    return await api.post('/orders', orderData);
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to place order' });
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/orders/my');
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to load orders' });
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    return await api.get(`/orders/${id}`);
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Order not found' });
  }
});

const initialState = {
  list: [],
  current: null,
  status: 'idle',
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
        state.list.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.current = action.payload;
      });
  },
});

export const { clearCurrent } = ordersSlice.actions;
export default ordersSlice.reducer;
