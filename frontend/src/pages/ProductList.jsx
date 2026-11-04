import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../features/products/productsSlice.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/Skeleton.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { Chip } from '../components/Chip.jsx';
import { Button } from '../components/Button.jsx';
import { formatMoney } from '../utils/money.js';

const CATEGORIES = [
  'supplements',
  'equipment',
  'apparel',
  'footwear',
  'accessories',
  'recovery',
];

const CATEGORY_LABELS = {
  supplements: 'Supplements',
  equipment: 'Equipment',
  apparel: 'Apparel',
  footwear: 'Footwear',
  accessories: 'Accessories',
  recovery: 'Recovery',
};

const PRICE_MAX = 20000;
const PRICE_STEP = 100;
const PAGE_SIZE = 12;

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [openFilters, setOpenFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(() => Number(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState(() => Number(searchParams.get('maxPrice')) || PRICE_MAX);
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') || '');

  const { items, total, page, pages, status, error } = useSelector((state) => state.products);

  const query = useMemo(() => {
    const stockFilter = searchParams.get('inStock');
    return {
      category: searchParams.get('category') || undefined,
      subCategory: searchParams.get('subCategory') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      minRating: searchParams.get('minRating') || undefined,
      inStock: stockFilter === 'true' ? true : stockFilter === 'false' ? false : undefined,
      sort: searchParams.get('sort') || 'newest',
      page: Math.max(Number(searchParams.get('page')) || 1, 1),
      limit: PAGE_SIZE,
    };
  }, [searchParams]);

  useEffect(() => {
    setMinPrice(Number(searchParams.get('minPrice')) || 0);
    setMaxPrice(Number(searchParams.get('maxPrice')) || PRICE_MAX);
    setMinRating(searchParams.get('minRating') || '');
    setCategory(searchParams.get('category') || '');
    setInStock(searchParams.get('inStock') || '');
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchProducts(query));
  }, [dispatch, query]);

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === undefined || value === '') params.delete(key);
    else params.set(key, String(value));
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const applyFilters = () => {
    if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice)
      || minPrice < 0 || maxPrice > PRICE_MAX || minPrice > maxPrice) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    const filters = {
      minPrice: minPrice > 0 ? String(minPrice) : '',
      maxPrice: maxPrice < PRICE_MAX ? String(maxPrice) : '',
      minRating,
      category,
      inStock,
    };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.set('page', '1');
    setSearchParams(params);
    setOpenFilters(false);
  };

  const clearFilters = () => {
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setMinRating('');
    setCategory('');
    setInStock('');

    const params = new URLSearchParams(searchParams);
    ['category', 'subCategory', 'minPrice', 'maxPrice', 'minRating', 'inStock'].forEach((key) => {
      params.delete(key);
    });
    params.set('page', '1');
    setSearchParams(params);
    setOpenFilters(false);
  };

  const cancelFilters = () => {
    setMinPrice(Number(searchParams.get('minPrice')) || 0);
    setMaxPrice(Number(searchParams.get('maxPrice')) || PRICE_MAX);
    setMinRating(searchParams.get('minRating') || '');
    setCategory(searchParams.get('category') || '');
    setInStock(searchParams.get('inStock') || '');
    setOpenFilters(false);
  };

  const activeFilters = [];
  if (query.category) {
    activeFilters.push({
      label: CATEGORY_LABELS[query.category] || query.category,
      key: 'category',
    });
  }
  if (query.subCategory) activeFilters.push({ label: query.subCategory, key: 'subCategory' });
  if (query.search) activeFilters.push({ label: `Search: ${query.search}`, key: 'search' });
  if (query.minPrice) {
    activeFilters.push({
      label: `Min ${formatMoney(Number(query.minPrice) * 100)}`,
      key: 'minPrice',
    });
  }
  if (query.maxPrice) {
    activeFilters.push({
      label: `Max ${formatMoney(Number(query.maxPrice) * 100)}`,
      key: 'maxPrice',
    });
  }
  if (query.minRating) activeFilters.push({ label: `${query.minRating}+ stars`, key: 'minRating' });
  if (query.inStock !== undefined) {
    activeFilters.push({
      label: query.inStock ? 'In stock' : 'Out of stock',
      key: 'inStock',
    });
  }

  const priceRangeInvalid = !Number.isFinite(minPrice)
    || !Number.isFinite(maxPrice)
    || minPrice < 0
    || maxPrice > PRICE_MAX
    || minPrice > maxPrice;

  const renderFilterContent = () => (
    <>
      <section>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-gray-500)]">Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(category === item ? '' : item)}
              className="text-left"
              aria-pressed={category === item}
            >
              <Chip selected={category === item} className="cursor-pointer">
                {CATEGORY_LABELS[item]}
              </Chip>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
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
              left: `${(minPrice / PRICE_MAX) * 100}%`,
              right: `${100 - (maxPrice / PRICE_MAX) * 100}%`,
            }}
          />
          <input
            type="range"
            min="0"
            max={PRICE_MAX - PRICE_STEP}
            step={PRICE_STEP}
            value={Math.min(minPrice, maxPrice - PRICE_STEP)}
            aria-label="Minimum price"
            onChange={(event) => setMinPrice(Math.min(Number(event.target.value), maxPrice - PRICE_STEP))}
            className="price-range__input price-range__input--lower"
          />
          <input
            type="range"
            min={PRICE_STEP}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={maxPrice}
            aria-label="Maximum price"
            onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), minPrice + PRICE_STEP))}
            className="price-range__input price-range__input--upper"
          />
        </div>
        <div className="flex justify-between text-[11px] text-[var(--color-gray-500)]">
          <span>{formatMoney(0)}</span>
          <span>{formatMoney(PRICE_MAX * 100)}+</span>
        </div>
        {priceRangeInvalid && (
          <p className="mt-2 text-xs text-[var(--color-danger-700)]" role="alert">
            Minimum price must not exceed maximum price.
          </p>
        )}
      </section>

      <section>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-gray-500)]">Customer rating</h3>
        <div className="flex flex-wrap gap-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setMinRating(minRating === String(rating) ? '' : String(rating))}
              aria-pressed={minRating === String(rating)}
              className={`flex min-h-10 items-center gap-1.5 rounded-pill border px-3 text-sm font-semibold transition ${
                minRating === String(rating)
                  ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-50)] text-[var(--color-primary-600)]'
                  : 'border-[var(--border)] text-[var(--text-body)] hover:border-[var(--color-primary-600)]'
              }`}
            >
              <span className="tracking-tight text-[var(--color-warning-700)]" aria-hidden="true">
                {'★'.repeat(rating)}<span className="text-[var(--color-gray-300)]">{'★'.repeat(5 - rating)}</span>
              </span>
              <span className="text-xs">&amp; up</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-gray-500)]">Availability</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'true', label: 'In stock' },
            { value: 'false', label: 'Out of stock' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setInStock(inStock === option.value ? '' : option.value)}
              aria-pressed={inStock === option.value}
            >
              <Chip selected={inStock === option.value} className="cursor-pointer">
                {option.label}
              </Chip>
            </button>
          ))}
        </div>
      </section>
    </>
  );

  const visiblePages = [...new Set([1, page - 2, page - 1, page, page + 1, page + 2, pages])]
    .filter((number) => number >= 1 && number <= pages)
    .sort((left, right) => left - right);

  return (
    <div className="container page py-6">
      <div className="space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h1 className="page-title">All products</h1>
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
                onChange={(event) => setParam('sort', event.target.value)}
                className="min-h-10 rounded-pill border border-[var(--border)] bg-[var(--bg-card)] px-4 text-sm text-[var(--text-body)] focus:border-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)]"
              >
                <option value="newest">Featured</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
        </header>

        {openFilters && (
          <aside
            id="product-filters"
            className="animate-pop-in rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm md:p-6"
          >
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-[var(--text-strong)]">Find your fit</h2>
                <p className="text-xs text-[var(--color-gray-500)]">Tune your filters, then apply to see matching gear.</p>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-pill">
                Clear all
              </Button>
            </div>

            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
              {renderFilterContent()}
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={cancelFilters} className="rounded-pill">Cancel</Button>
              <Button
                variant="primary"
                onClick={applyFilters}
                disabled={priceRangeInvalid}
                className="rounded-pill px-7"
              >
                Apply filters
              </Button>
            </div>
          </aside>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="self-center text-xs font-semibold text-[var(--color-gray-500)]">Active filters</span>
              {activeFilters.map((filter) => (
                <Chip
                  key={`${filter.key}-${filter.label}`}
                  removable
                  onRemove={() => setParam(filter.key, undefined)}
                >
                  {filter.label}
                </Chip>
              ))}
            </div>
          )}
          <p className="text-xs text-[var(--color-gray-500)] sm:text-right" aria-live="polite">
            Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of {total}
          </p>
        </div>

        {status === 'failed' ? (
          <ErrorState
            message={error || 'Could not load products.'}
            onRetry={() => dispatch(fetchProducts(query))}
          />
        ) : status === 'loading' ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6" aria-label="Loading products" aria-busy="true">
            {Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={index} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[var(--color-gray-500)]">No products match your filters.</p>
            <Button variant="ghost" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {status !== 'loading' && status !== 'failed' && pages > 1 && (
          <nav className="flex items-center gap-2" aria-label="Product pages">
            <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setParam('page', page - 1)} aria-label="Previous page">
              ‹
            </Button>
            {visiblePages.map((number, index) => (
              <span key={number} className="contents">
                {index > 0 && number - visiblePages[index - 1] > 1 && (
                  <span className="text-xs text-[var(--color-gray-500)]" aria-hidden="true">…</span>
                )}
                <Button
                  variant={page === number ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setParam('page', number)}
                  aria-current={page === number ? 'page' : undefined}
                  className="h-8 w-8"
                >
                  {number}
                </Button>
              </span>
            ))}
            <Button variant="ghost" size="sm" disabled={page >= pages} onClick={() => setParam('page', page + 1)} aria-label="Next page">
              ›
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}
