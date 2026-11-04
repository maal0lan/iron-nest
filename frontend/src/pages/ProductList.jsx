import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../features/products/productsSlice.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/Skeleton.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { Chip } from '../components/Chip.jsx';
import { Button } from '../components/Button.jsx';
import { formatMoney } from '../utils/money.js';

const CATEGORIES = [
  'supplements', 'equipment', 'apparel', 'footwear', 'accessories', 'recovery',
];
const CATEGORY_LABELS = {
  supplements: 'Supplements',
  equipment: 'Equipment',
  apparel: 'Apparel',
  footwear: 'Footwear',
  accessories: 'Accessories',
  recovery: 'Recovery',
};
const PRICE_SLIDER_MAX = 20000;

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [openFilters, setOpenFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(() => Number(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState(() => Number(searchParams.get('maxPrice')) || PRICE_SLIDER_MAX);
  const [minRating, setMinRating] = useState(() => searchParams.get('minRating') || '');
  const [category, setCategory] = useState(() => searchParams.get('category') || '');
  const [inStock, setInStock] = useState(() => searchParams.get('inStock') || '');

  const { items, total, page, pages, status, error } = useSelector((state) => state.products);

  const appliedMinPrice = searchParams.get('minPrice');
  const appliedMaxPrice = searchParams.get('maxPrice');
  const appliedMinRating = searchParams.get('minRating');
  const appliedCategory = searchParams.get('category') || '';
  const appliedInStock = searchParams.get('inStock') || '';
  useEffect(() => {
    setMinPrice(Number(appliedMinPrice) || 0);
    setMaxPrice(Number(appliedMaxPrice) || PRICE_SLIDER_MAX);
    setMinRating(appliedMinRating || '');
    setCategory(appliedCategory);
    setInStock(appliedInStock);
  }, [appliedMinPrice, appliedMaxPrice, appliedMinRating, appliedCategory, appliedInStock]);

  const query = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    subCategory: searchParams.get('subCategory') || undefined,
    search: searchParams.get('search') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    minRating: searchParams.get('minRating') || undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : searchParams.get('inStock') === 'false' ? false : undefined,
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  }), [searchParams]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts(query));
  }, [dispatch, query]);

  const activeFilters = [];
  if (query.category) activeFilters.push({ label: CATEGORY_LABELS[query.category] || query.category, key: 'category' });
  if (query.subCategory) activeFilters.push({ label: query.subCategory, key: 'subCategory' });
  if (query.search) activeFilters.push({ label: `Search: ${query.search}`, key: 'search' });
  if (query.minPrice) activeFilters.push({ label: `Min ${formatMoney(Number(query.minPrice) * 100)}`, key: 'minPrice' });
  if (query.maxPrice) activeFilters.push({ label: `Max ${formatMoney(Number(query.maxPrice) * 100)}`, key: 'maxPrice' });
  if (query.minRating) activeFilters.push({ label: `${query.minRating}+ stars`, key: 'minRating' });
  if (query.inStock !== undefined) activeFilters.push({ label: query.inStock ? 'In stock' : 'Out of stock', key: 'inStock' });

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === undefined || value === '') params.delete(key);
    else params.set(key, value);
    params.set('page', '1');
    setSearchParams(params);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (minPrice > 0) params.set('minPrice', String(minPrice));
    else params.delete('minPrice');
    if (maxPrice < PRICE_SLIDER_MAX) params.set('maxPrice', String(maxPrice));
    else params.delete('maxPrice');
    if (minRating) params.set('minRating', minRating);
    else params.delete('minRating');
    if (category) params.set('category', category);
    else params.delete('category');
    if (inStock) params.set('inStock', inStock);
    else params.delete('inStock');
    params.set('page', '1');
    setSearchParams(params);
    setOpenFilters(false);
  };

  const clearFilters = () => {
    setMinPrice(0);
    setMaxPrice(PRICE_SLIDER_MAX);
    setMinRating('');
    setCategory('');
    setInStock('');
    setSearchParams(new URLSearchParams());
  };

  const cancelFilters = () => {
    setMinPrice(Number(appliedMinPrice) || 0);
    setMaxPrice(Number(appliedMaxPrice) || PRICE_SLIDER_MAX);
    setMinRating(appliedMinRating || '');
    setCategory(appliedCategory);
    setInStock(appliedInStock);
    setOpenFilters(false);
  };

  return (
    <div className="container page py-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h1 className="font-heading text-xl font-bold text-[var(--text-strong)] md:text-2xl">All products</h1>
            <p className="text-sm text-[var(--color-gray-500)]">{total} products to explore</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={openFilters ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setOpenFilters((isOpen) => !isOpen)}
              aria-expanded={openFilters}
              aria-controls="product-filters"
              className="rounded-pill"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h16M7 12h10m-7 5h4" />
                <circle cx="8" cy="7" r="1.5" fill="currentColor" />
                <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                <circle cx="11" cy="17" r="1.5" fill="currentColor" />
              </svg>
              Filters
              {activeFilters.length > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--bg-card)] px-1 text-[10px] text-[var(--color-primary-600)]">
                  {activeFilters.length}
                </span>
              )}
            </Button>
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-gray-500)]">
              <span>Sort by</span>
              <select
                value={query.sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="min-h-10 rounded-pill border border-[var(--border)] bg-[var(--bg-card)] px-4 text-sm text-[var(--text-body)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
              >
                <option value="newest">Featured</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
        </div>

        {openFilters && (
          <aside id="product-filters" className="animate-pop-in rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm md:p-6">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-[var(--text-strong)]">Find your fit</h2>
                <p className="text-xs text-[var(--color-gray-500)]">Tune your filters, then apply to see matching gear.</p>
              </div>
              <button type="button" onClick={clearFilters} className="rounded-pill px-3 py-2 text-xs font-semibold text-[var(--color-primary-600)] transition hover:bg-[var(--color-primary-50)]">
                Clear all
              </button>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
              <section>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-gray-500)]">Category</h3>
                <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const selected = category === cat;
                  return (
                    <Chip
                      key={cat}
                      selected={selected}
                      onClick={() => setCategory(selected ? '' : cat)}
                      className="cursor-pointer"
                    >
                      {CATEGORY_LABELS[cat]}
                    </Chip>
                  );
                })}
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-gray-500)]">Price range</h3>
                  <span className="rounded-pill bg-[var(--color-primary-50)] px-2.5 py-1 text-xs font-bold text-[var(--color-primary-600)]">
                    {formatMoney(minPrice * 100)} – {formatMoney(maxPrice * 100)}
                  </span>
                </div>
                <div className="price-range relative mb-2 h-8">
                  <div className="price-range__track" />
                  <div
                    className="price-range__selection"
                    style={{
                      left: `${(minPrice / PRICE_SLIDER_MAX) * 100}%`,
                      right: `${100 - (maxPrice / PRICE_SLIDER_MAX) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={PRICE_SLIDER_MAX}
                    step="100"
                    value={minPrice}
                    aria-label="Minimum price"
                    onChange={(event) => setMinPrice(Math.min(Number(event.target.value), maxPrice - 5))}
                    className="price-range__input price-range__input--lower"
                  />
                  <input
                    type="range"
                    min="0"
                    max={PRICE_SLIDER_MAX}
                    step="100"
                    value={maxPrice}
                    aria-label="Maximum price"
                    onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), minPrice + 5))}
                    className="price-range__input price-range__input--upper"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[var(--color-gray-500)]">
                  <span>{formatMoney(0)}</span><span>{formatMoney(PRICE_SLIDER_MAX * 100)}+</span>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-gray-500)]">Customer rating</h3>
                <div className="flex flex-wrap gap-2">
                  {[4, 3, 2, 1].map((rating) => {
                    const selected = minRating === String(rating);
                    return (
                      <button
                        key={rating}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setMinRating(selected ? '' : String(rating))}
                        className={`flex min-h-10 items-center gap-1.5 rounded-pill border px-3 text-sm font-semibold transition ${
                          selected
                            ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)]'
                            : 'border-[var(--border)] text-[var(--text-body)] hover:border-[var(--color-primary-600)]'
                        }`}
                      >
                        <span className="tracking-tight text-[var(--color-warning-700)]" aria-hidden="true">
                          {'★'.repeat(rating)}<span className="text-[var(--color-gray-300)]">{'★'.repeat(5 - rating)}</span>
                        </span>
                        <span className="text-xs">& up</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-gray-500)]">Availability</h3>
                <div className="flex flex-wrap gap-2">
                <Chip
                  selected={inStock === 'true'}
                  onClick={() => setInStock(inStock === 'true' ? '' : 'true')}
                  className="cursor-pointer"
                >
                  In stock
                </Chip>
                <Chip
                  selected={inStock === 'false'}
                  onClick={() => setInStock(inStock === 'false' ? '' : 'false')}
                  className="cursor-pointer"
                >
                  Out of stock
                </Chip>
              </div>
              </section>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={cancelFilters} className="rounded-pill">Cancel</Button>
              <Button variant="primary" onClick={applyFilters} className="rounded-pill px-7">Apply filters</Button>
            </div>
          </aside>
        )}

        {/* Results */}
        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="self-center text-xs font-semibold text-[var(--color-gray-500)]">Active filters</span>
                {activeFilters.map((f) => (
                  <Chip key={`${f.label}-${f.key}`} removable onRemove={() => setParam(f.key, undefined)}>
                    {f.label}
                  </Chip>
                ))}
              </div>
            )}
            <div className="text-xs text-[var(--color-gray-500)] sm:text-right">
              Showing {((page - 1) * 12) + 1} to {Math.min(page * 12, total)} of {total}
            </div>
          </div>

          {status === 'failed' ? (
            <ErrorState message={error || 'Could not load products.'} onRetry={() => dispatch(fetchProducts(query))} />
          ) : status === 'loading' ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6" aria-label="Loading products" aria-busy="true">
              {[...Array(8)].map((_, index) => <ProductCardSkeleton key={index} />)}
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[var(--color-gray-500)]">No products match your filters.</p>
              <Button variant="ghost" onClick={() => setSearchParams(new URLSearchParams())} className="mt-4">
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-10 flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setParam('page', page - 1)}>‹</Button>
              {[...Array(pages)].map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === pages || Math.abs(p - page) <= 2) {
                  return (
                    <Button
                      key={p}
                      variant={page === p ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setParam('page', p)}
                      className="w-8 h-8"
                    >
                      {p}
                    </Button>
                  );
                }
                if (p === 2 || p === pages - 1) return null;
                return <span key={`gap-${p}`} className="text-xs text-[var(--color-gray-500)]">…</span>;
              })}
              <Button variant="ghost" size="sm" disabled={page === pages} onClick={() => setParam('page', page + 1)}>›</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
