import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../features/auth/authSlice.js';
import { setTheme, selectTheme } from '../features/theme/themeSlice.js';
import { selectItemCount } from '../features/cart/cartSlice.js';

export default function Navbar() {
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);
  const theme = useSelector(selectTheme);
  const itemCount = useSelector(selectItemCount);
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const themes = [
    { name: 'light', label: 'Light', icon: '☀' },
    { name: 'dark', label: 'Dark', icon: '☾' },
    { name: 'iron', label: 'Iron', icon: '⚡' },
    { name: 'neon', label: 'Neon', icon: '✦' },
  ];

  const isListPage = location.pathname === '/' || location.pathname === '/products';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    window.location.href = `/products?search=${encodeURIComponent(search.trim())}`;
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--border)] shadow-sm"
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--bg-header)',
        color: 'var(--text-strong)',
      }}
    >
      <div className="flex items-center justify-between h-full px-4 max-w-[1200px] mx-auto">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="rounded-lg bg-[var(--color-primary-600)] px-2 py-0.5 text-xs font-bold text-white">I</span>
          <span className="font-heading font-bold text-lg tracking-tight text-[var(--text-strong)]">IronNest</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/products"
            className={`px-3 py-2 rounded-md transition ${isListPage ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]' : 'text-[var(--text-body)] hover:text-[var(--color-primary-600)]'}`}
          >
            Products
          </Link>
          {token && (
            <>
              <Link to="/orders" className="text-[var(--text-body)] hover:text-[var(--color-primary-600)]">My orders</Link>
              <Link to="/wishlist" className="text-[var(--text-body)] hover:text-[var(--color-primary-600)]">Wishlist</Link>
              {(user.role === 'seller' || user.role === 'admin') && (
                <Link to="/seller" className="text-[var(--text-body)] hover:text-[var(--color-primary-600)]">Seller</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-[var(--text-body)] hover:text-[var(--color-primary-600)]">Admin</Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {!token ? (
            <Link to="/login" className="rounded-md bg-[var(--color-primary-600)] text-white px-4 py-1.5 text-sm font-semibold hover:bg-[var(--color-primary-700)] transition">
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full bg-[var(--color-gray-200)] px-3 py-1.5 text-sm text-[var(--text-strong)] hover:bg-[var(--color-gray-300)] transition"
                aria-label="Open user menu"
              >
                <span className="w-6 h-6 rounded-full bg-[var(--color-primary-600)] flex items-center justify-center text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden md:inline text-[var(--text-body)]">{user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-lg py-2 z-50">
                  <Link to="/orders" className="block px-4 py-2 text-sm text-[var(--text-body)] hover:bg-[var(--color-gray-50)]">My orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-sm text-[var(--text-body)] hover:bg-[var(--color-gray-50)]">Wishlist</Link>
                  {(user.role === 'seller' || user.role === 'admin') && (
                    <Link to="/seller" className="block px-4 py-2 text-sm text-[var(--text-body)] hover:bg-[var(--color-gray-50)]">Seller dashboard</Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-[var(--text-body)] hover:bg-[var(--color-gray-50)]">Admin dashboard</Link>
                  )}
                  <div className="border-t border-[var(--border)] mt-2 pt-2">
                    <button
                      onClick={() => { dispatch(logout()); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-[var(--color-danger-700)] hover:bg-[var(--color-danger-50)]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => {
              const idx = themes.findIndex((t) => t.name === theme);
              const next = themes[(idx + 1) % themes.length];
              dispatch(setTheme(next.name));
            }}
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] transition"
            title="Change theme"
            aria-label="Theme switcher"
          >
            <span className="text-sm">{themes.find((t) => t.name === theme)?.icon}</span>
          </button>
          <form onSubmit={handleSearchSubmit} className="relative">
            <button
              type="button"
              onClick={() => setSearch((s) => (s ? '' : 'search'))}
              className="relative w-8 h-8"
            >
              <svg className="w-5 h-5 text-[var(--color-gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {search && (
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className="absolute right-full mr-2 w-64 min-h-[44px] rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 text-sm text-[var(--text-body)] shadow-md focus:outline-none focus:border-[var(--color-primary-600)]"
              />
            )}
          </form>
          <Link
            to="/cart"
            className="relative w-8 h-8"
            title={`Cart (${itemCount})`}
          >
            <svg className="w-5 h-5 text-[var(--color-gray-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-danger-700)] text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
