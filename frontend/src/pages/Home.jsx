import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../features/products/productsSlice.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/Skeleton.jsx';
import { ErrorState } from '../components/ErrorState.jsx';

const CATEGORIES = [
  { slug: 'supplements', label: 'Supplements', blurb: 'Protein, pre-workout, creatine' },
  { slug: 'equipment', label: 'Equipment', blurb: 'Dumbbells, bands, home gym' },
  { slug: 'apparel', label: 'Apparel', blurb: 'Tops and shorts' },
  { slug: 'footwear', label: 'Footwear', blurb: 'Training shoes' },
  { slug: 'accessories', label: 'Accessories', blurb: 'Shakers, lifting straps' },
  { slug: 'recovery', label: 'Recovery', blurb: 'Foam rollers and more' },
];

// Store rules (README): shipping, coupons.
const PERKS = [
  'Free shipping over ₹999',
  '10% off your cart',
  '15% off orders ₹2,000+',
  '₹50 off orders ₹500+',
  'Independent fitness sellers',
  'Demo checkout',
];

const COUPONS = [
  { title: '10% off', note: 'On your whole cart' },
  { title: '15% off', note: 'Orders of ₹2,000 or more' },
  { title: '₹50 off', note: 'Orders of ₹500 or more' },
];

const btnPrimary =
  'inline-flex min-h-[var(--control-lg)] items-center justify-center rounded-md bg-[var(--color-primary-600)] px-7 text-base font-semibold text-[var(--on-primary)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[var(--color-primary-700)] hover:shadow-glow';
const btnOutlineLight =
  'inline-flex min-h-[var(--control-lg)] items-center justify-center rounded-md border border-white/40 px-7 text-base font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/10';

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);
  const load = () => dispatch(fetchProducts({ sort: 'featured', limit: 8 }));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="container page pb-4 pt-6">
      {/* Hero */}
      <section className="hero animate-fade-in px-6 py-12 sm:px-10 md:py-20 lg:px-14">
        <img
          className="hero__img"
          src="https://images.unsplash.com/photo-1534438327275-194e9ad50e25?w=1400&q=80"
          alt=""
          aria-hidden="true"
        />
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <span className="eyebrow !text-[var(--color-accent-600)] inline-flex items-center gap-2">
              <span className="h-px w-8 bg-current" /> This week only
            </span>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Train harder.
              <br />
              <span className="text-gradient">Save smarter.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/80 sm:text-lg">
              Gear from independent fitness sellers. Get 10% off your cart,
              and ship free on orders of ₹999 or more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className={btnPrimary}>Shop deals</Link>
              <a href="#categories" className={btnOutlineLight}>Browse categories</a>
            </div>
          </div>

          {/* Coupon stack */}
          <div className="hidden gap-3 lg:grid" aria-label="Current offers">
            {COUPONS.map((c, i) => (
              <div
                key={c.title}
                className="animate-fade-up flex items-center justify-between rounded-lg border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-md"
                style={{ animationDelay: `${150 + i * 110}ms`, marginLeft: `${i * 18}px` }}
              >
                <div>
                  <p className="font-display text-2xl font-semibold uppercase tracking-wide text-white">{c.title}</p>
                  <p className="text-xs text-white/70">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks ticker */}
      <div className="marquee my-8 border-y border-[var(--border)] py-3" aria-hidden="true">
        <div className="marquee__track animate-marquee">
          {[0, 1].map((n) => (
            <ul key={n} className="flex shrink-0 items-center">
              {PERKS.map((p) => (
                <li key={p} className="flex items-center whitespace-nowrap font-display text-sm font-semibold uppercase tracking-[.18em] text-[var(--text-muted)]">
                  <span className="px-6">{p}</span>
                  <span className="text-[var(--color-primary-600)]">◆</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section id="categories" className="mb-14 scroll-mt-[calc(var(--header-height)+16px)]">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="section-title text-2xl md:text-3xl">Shop by category</h2>
          <Link to="/products" className="text-sm font-semibold text-[var(--color-primary-600)] hover:underline">All products →</Link>
        </div>
        <div className="grid grid-cols-2 gap-[var(--grid-gap)] md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              to={`/products?category=${c.slug}`}
              className="tile group rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-primary-600)] hover:shadow-md md:p-5"
            >
              <span className="font-display text-4xl font-bold leading-none text-[var(--color-gray-300)] transition-colors group-hover:text-[var(--color-primary-600)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 font-heading text-base font-semibold text-[var(--text-strong)]">{c.label}</h3>
              <p className="mt-1 text-xs leading-4 text-[var(--text-muted)]">{c.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[var(--color-primary-600)] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="section-title text-2xl md:text-3xl">Featured</h2>
          <Link to="/products" className="text-sm font-semibold text-[var(--color-primary-600)] hover:underline">View all →</Link>
        </div>

        {status === 'failed' || error ? (
          <ErrorState onRetry={load} />
        ) : status === 'loading' || status === 'idle' ? (
          <div className="grid grid-cols-2 gap-[var(--grid-gap)] md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <p className="text-[var(--text-muted)]">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-[var(--grid-gap)] md:grid-cols-3 lg:grid-cols-4">
            {items.map((product, i) => (
              <div key={product._id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 7) * 60}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Coupon banner */}
      <section className="mb-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
        <div className="grid gap-px bg-[var(--border)] md:grid-cols-3">
          {COUPONS.map((c) => (
            <div key={c.title} className="flex items-center justify-between gap-4 bg-[var(--bg-card)] p-6">
              <div>
                <p className="font-display text-3xl font-bold uppercase text-[var(--text-strong)]">{c.title}</p>
                <p className="text-sm text-[var(--text-muted)]">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
