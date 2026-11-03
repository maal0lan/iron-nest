import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';
import { unitPrice, subtotal, couponDiscount, shipping, total, couponInfo } from '../../utils/pricing.js';

const loadCart = () => {
  try {
    const raw = localStorage.getItem('ironnest_cart');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const validateCoupon = createAsyncThunk('cart/validateCoupon', async ({ code, subtotalCents }, { rejectWithValue }) => {
  try {
    return await api.post('/coupons/validate', { code, subtotalCents });
  } catch (err) {
    return rejectWithValue(err.data || { valid: false, message: 'Invalid coupon code' });
  }
});

const initialState = loadCart() || {
  items: [],
  couponCode: '',
  couponStatus: 'idle',
  couponError: null,
};

const findItem = (state, productId) => state.items.find((i) => i.productId === productId);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = findItem(state, product._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        state.items.push({
          productId: product._id,
          title: product.title,
          image: (product.images && product.images[0]) || product.thumbnail || '',
          category: product.category,
          priceCents: product.priceCents,
          discountPercentage: product.discountPercentage || 0,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock),
        });
      }
      state.couponError = null;
    },
    increase: (state, action) => {
      const item = findItem(state, action.payload);
      if (item && item.quantity < item.stock) item.quantity += 1;
    },
    decrease: (state, action) => {
      const item = findItem(state, action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) state.items = state.items.filter((i) => i.productId !== action.payload);
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.couponCode = '';
      state.couponStatus = 'idle';
      state.couponError = null;
    },
    setCoupon: (state, action) => {
      state.couponCode = action.payload;
      state.couponStatus = 'idle';
      state.couponError = null;
    },
    clearCouponError: (state) => {
      state.couponError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => { state.couponStatus = 'loading'; state.couponError = null; })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.couponStatus = 'succeeded';
        if (action.payload.valid) {
          state.couponCode = action.payload.code;
          state.couponError = null;
        } else {
          state.couponError = action.payload.message || 'Invalid coupon code';
        }
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.couponStatus = 'failed';
        state.couponError = action.payload.message || 'Invalid coupon code';
      });
  },
});

export const { addItem, increase, decrease, removeItem, clearCart, setCoupon, clearCouponError } = cartSlice.actions;

// Selectors
export const selectCart = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectItemCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) => subtotal(state.cart.items);
export const selectCartCoupon = (state) => state.cart.couponCode;
export const selectCartCouponStatus = (state) => state.cart.couponStatus;
export const selectCartCouponError = (state) => state.cart.couponError;

export const selectCartDiscount = (state) => {
  const coupon = couponInfo(state.cart.couponCode);
  return couponDiscount(selectCartSubtotal(state), coupon);
};

export const selectCartShipping = (state) => {
  const coupon = couponInfo(state.cart.couponCode);
  return shipping(selectCartSubtotal(state), coupon);
};

export const selectCartTotal = (state) =>
  total(selectCartSubtotal(state), selectCartDiscount(state), selectCartShipping(state));

export const selectCartQtyByProductId = (state) => (productId) => {
  const item = state.cart.items.find((i) => i.productId === productId);
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;
