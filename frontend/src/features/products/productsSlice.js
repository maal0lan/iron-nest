import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api.js';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (query = {}, { rejectWithValue }) => {
  const params = new URLSearchParams();
  if (query.category) params.set('category', query.category);
  if (query.subCategory) params.set('subCategory', query.subCategory);
  if (query.seller) params.set('seller', query.seller);
  if (query.search) params.set('search', query.search);
  if (query.minPrice) params.set('minPrice', query.minPrice);
  if (query.maxPrice) params.set('maxPrice', query.maxPrice);
  if (query.minRating) params.set('minRating', query.minRating);
  if (query.inStock !== undefined) params.set('inStock', query.inStock);
  if (query.sort) params.set('sort', query.sort);
  params.set('page', query.page || 1);
  params.set('limit', query.limit || 12);

  try {
    const data = await api.get(`/products?${params}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Failed to load products' });
  }
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    return await api.get(`/products/${id}`);
  } catch (err) {
    return rejectWithValue(err.data || { message: 'Product not found' });
  }
});

export const fetchRelated = createAsyncThunk('products/fetchRelated', async (id, { rejectWithValue }) => {
  try {
    return await api.get(`/products/${id}/related`);
  } catch (err) {
    return rejectWithValue([]);
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    return await api.get('/products/categories');
  } catch (err) {
    return rejectWithValue([]);
  }
});

const initialState = {
  items: [],
  total: 0,
  page: 1,
  pages: 1,
  status: 'idle',
  error: null,
  current: null,
  related: [],
  categories: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProduct(state) {
      state.current = null;
      state.related = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(fetchProductById.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(fetchRelated.fulfilled, (state, action) => { state.related = action.payload; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; });
  },
});

export const { clearProduct } = productsSlice.actions;
export default productsSlice.reducer;
