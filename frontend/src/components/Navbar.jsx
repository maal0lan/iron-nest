import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice.js';
import { selectItemCount } from '../features/cart/cartSlice.js';
import ThemeToggle from './ThemeToggle.jsx';

const iconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', viewBox: '0 0 24 24', 'aria-hidden': true };

function SearchIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...iconProps}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const itemCount = useSelector(selectItemCount);

  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const userRef = useRef(null);

  const role = user?.role;
  const isSeller = role === 'seller' || role === 'admin';

  // close menus on navigation
  useEffect(() => {
    setUserOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!userOpen) return;
    const onDown = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setUserOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [userOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  const links = [
    { to: '/products', label: 'Products' },
    ...(token
      ? [
          { to: '/orders', label: 'My orders' },
          { to: '/wishlist', label: 'Wishlist' },
          ...(isSeller ? [{ to: '/seller', label: 'Seller' }] : []),
          ...(role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
        ]
      : []),
  ];

  const navClass = ({ isActive }) =>
    `nav-link rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
      isActive ? 'text-[var(--on-header)]' : 'text-[var(--on-header-muted)] hover:text-[var(--on-header)]'
    }`;

  const searchForm = (idSuffix) => (
    <form onSubmit={handleSearchSubmit} role="search" className="relative w-full">
      <label htmlFor={`site-search-${idSuffix}`} className="sr-only">Search products</label>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--on-header-muted)]">
        <SearchIcon className="h-[18px] w-[18px]" />
      </span>
      <input
        id={`site-search-${idSuffix}`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for products, brands and more"
        className="min-h-[var(--control-md)] w-full rounded-pill border border-[color-mix(in_srgb,var(--on-header)_16%,transparent)] bg-[color-mix(in_srgb,var(--on-header)_8%,transparent)] pl-10 pr-4 text-sm text-[var(--on-header)] placeholder:text-[var(--on-header-muted)] transition-all focus:border-[var(--color-primary-600)] focus:bg-[color-mix(in_srgb,var(--on-header)_12%,transparent)] focus:outline-none focus:ring-[3px] focus:ring-[var(--color-focus-ring)]"
      />
    </form>
  );

  return (
    <>
      <header className="glass fixed inset-x-0 top-0 z-40 text-[var(--on-header)]" style={{ height: 'var(--header-height)' }}>
        <div className="mx-auto flex h-full max-w-[var(--container-max)] items-center gap-3 px-[var(--page-padding)] md:gap-6">
          {/* Logo */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="IronNest home">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-[linear-gradient(135deg,var(--color-primary-600),var(--color-secondary-600))] font-display text-lg font-bold text-[var(--on-primary)] shadow-glow transition-transform duration-200 group-hover:-rotate-6">
              I
            </span>
            <span className="font-display text-lg font-bold uppercase tracking-wider text-[var(--on-header)] sm:text-xl">
              Iron<span className="text-[var(--color-primary-600)]">Nest</span>
            </span>
          </Link>

          {/* Desktop search (wide, per design system) */}
          <div className="hidden max-w-xl flex-1 md:block">{searchForm('desktop')}</div>

          {/* Desktop nav */}
          <nav className="hidden items-center lg:flex" aria-label="Primary">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>{l.label}</NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="hidden h-10 w-10 place-items-center rounded-full text-[var(--on-header)] transition-colors hover:bg-[color-mix(in_srgb,var(--on-header)_10%,transparent)] sm:grid md:hidden"
              aria-label="Search products"
              aria-expanded={mobileOpen}
            >
              <SearchIcon />
            </button>

            <ThemeToggle />

            {/* Cart */}
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-[var(--on-header)] transition-colors hover:bg-[color-mix(in_srgb,var(--on-header)_10%,transparent)]"
              aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
            >
              <svg className="h-5 w-5" {...iconProps}>
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[20px] place-items-center rounded-full bg-[var(--danger-solid)] px-1 text-[11px] font-bold leading-none text-white ring-2 ring-[var(--bg-header)]">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {!token ? (
              <Link
                to="/login"
                className="hidden min-h-[var(--control-sm)] items-center rounded-md bg-[var(--color-primary-600)] px-4 text-sm font-semibold text-[var(--on-primary)] transition-all hover:bg-[var(--color-primary-700)] hover:shadow-glow sm:inline-flex"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-pill border border-[color-mix(in_srgb,var(--on-header)_18%,transparent)] py-1 pl-1 pr-3 transition-colors hover:bg-[color-mix(in_srgb,var(--on-header)_10%,transparent)]"
                  aria-label="Open user menu"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-primary-600)] text-sm font-bold text-[var(--on-primary)]">
                    {(user?.name || '?').charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[110px] truncate text-sm font-medium text-[var(--on-header)] sm:inline">{user?.name}</span>
                </button>
                {userOpen && (
                  <div role="menu" className="animate-pop-in absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-card)] py-1.5 shadow-lg">
                    <div className="border-b border-[var(--border)] px-4 pb-2 pt-1.5">
                      <p className="truncate text-sm font-semibold text-[var(--text-strong)]">{user?.name}</p>
                      <p className="text-xs capitalize text-[var(--text-muted)]">{role}</p>
                    </div>
                    {[
                      ['/orders', 'My orders'],
                      ['/wishlist', 'Wishlist'],
                      ...(isSeller ? [['/seller', 'Seller dashboard']] : []),
                      ...(role === 'admin' ? [['/admin', 'Admin dashboard']] : []),
                    ].map(([to, label]) => (
                      <Link key={to} to={to} role="menuitem" className="block px-4 py-2 text-sm text-[var(--text-body)] transition-colors hover:bg-[var(--color-gray-100)] hover:text-[var(--text-strong)]">
                        {label}
                      </Link>
                    ))}
                    <div className="mt-1 border-t border-[var(--border)] pt-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => { dispatch(logout()); setUserOpen(false); }}
                        className="w-full px-4 py-2 text-left text-sm font-medium text-[var(--color-danger-700)] transition-colors hover:bg-[var(--color-danger-50)]"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--on-header)] transition-colors hover:bg-[color-mix(in_srgb,var(--on-header)_10%,transparent)] lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg className="h-5 w-5" {...iconProps}>
                {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet panel */}
      {mobileOpen && (
        <div className="glass animate-pop-in fixed inset-x-0 z-30 lg:hidden" style={{ top: 'var(--header-height)' }}>
          <div className="mx-auto max-w-[var(--container-max)] space-y-3 px-[var(--page-padding)] py-4">
            <div className="md:hidden">{searchForm('mobile')}</div>
            <nav className="flex flex-col" aria-label="Mobile">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-3 text-base font-semibold transition-colors ${isActive ? 'bg-[color-mix(in_srgb,var(--on-header)_10%,transparent)] text-[var(--on-header)]' : 'text-[var(--on-header-muted)] hover:text-[var(--on-header)]'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {!token && (
                <Link to="/login" className="mt-2 inline-flex min-h-[var(--control-md)] items-center justify-center rounded-md bg-[var(--color-primary-600)] text-sm font-semibold text-[var(--on-primary)]">
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export { Navbar };
export default Navbar;
