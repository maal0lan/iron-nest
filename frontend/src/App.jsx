import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/store.js';
import { loadMe } from './features/auth/authSlice.js';
import { fetchWishlist } from './features/wishlist/wishlistSlice.js';
import { selectTheme } from './features/theme/themeSlice.js';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CursorFx from './components/CursorFx.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderPlaced from './pages/OrderPlaced.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MyOrders from './pages/MyOrders.jsx';
import Wishlist from './pages/Wishlist.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppContent() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    dispatch(loadMe());
  }, [dispatch]);

  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    if (token) dispatch(fetchWishlist());
  }, [dispatch, token]);

  // Re-apply the saved theme on every load (not only when the user switches it).
  useEffect(() => {
    const root = document.documentElement;
    if (theme && theme !== 'light') root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
  }, [theme]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)] text-[var(--text-body)]">
      <ScrollToTop />
      <CursorFx enabled />
      <Navbar />
      <main className="pt-header flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderPlaced />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<ProtectedRoute roles={['customer', 'seller', 'admin']}><MyOrders /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute roles={['customer', 'seller', 'admin']}><Wishlist /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute roles={['seller', 'admin']}><SellerDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
