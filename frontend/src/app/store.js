import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice.js';
import productsReducer from '../features/products/productsSlice.js';
import cartReducer from '../features/cart/cartSlice.js';
import themeReducer from '../features/theme/themeSlice.js';
import ordersReducer from '../features/orders/ordersSlice.js';
import wishlistReducer from '../features/wishlist/wishlistSlice.js';
import sellerReducer from '../features/seller/sellerSlice.js';
import adminReducer from '../features/admin/adminSlice.js';
import { setTokenGetter } from '../../utils/api.js';

const persistConfig = {
  key: 'ironnest',
  storage,
  whitelist: ['cart', 'auth', 'theme'],
};

const persistedAuth = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuth,
    products: productsReducer,
    cart: cartReducer,
    theme: themeReducer,
    orders: ordersReducer,
    wishlist: wishlistReducer,
    seller: sellerReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Wire the token getter so api.js can read the current token from redux state
setTokenGetter(() => store.getState().auth.token);
