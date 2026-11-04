import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../features/products/productsSlice.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/Skeleton.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { Chip } from '../components/Chip.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
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
const PAGE_SIZE = 12;

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [openFilters, setOpenFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
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
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
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
    const min = minPrice === '' ? undefined : Number(minPrice);
    const max = maxPrice === '' ? undefined : Number(maxPrice);
    if ((min !== undefined && (!Number.isFinite(min) || min < 0))
      || (max !== undefined && (!Number.isFinite(max) || max < 0))
      || (min !== undefined && max !== undefined && min > max)) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    const filters = {
      minPrice: min !== undefined && min > 0 ? String(min) : '',
      maxPrice: max !== undefined && max < PRICE_MAX ? String(max) : '',
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
    setMinPrice('');
    setMaxPrice('');
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
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
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

  const priceRangeInvalid = (minPrice !== ''
    && (!Number.isFinite(Number(minPrice)) || Number(minPrice) < 0))
    || (maxPrice !== '' && (!Number.isFinite(Number(maxPrice)) || Number(maxPrice) < 0))
    || (minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice));

  const renderFilterContent = (idPrefix) => (
    <>
      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase text-[var(--color-gray-500)]">Category</p>
        <div className="space-y-2">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(category === item ? '' : item)}
              className="block w-full text-left"
              aria-pressed={category === item}
            >
              <Chip selected={category === item} className="w-full justify-start">
                {CATEGORY_LABELS[item]}
              </Chip>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase text-[var(--color-gray-500)]">Price (₹)</p>
        <div className="flex gap-3">
          <Input
            id={`${idPrefix}-minPrice`}
            type="number"
            min="0"
            placeholder="Min"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            className="min-w-0 flex-1"
            aria-label="Minimum price"
          />
          <Input
            id={`${idPrefix}-maxPrice`}
            type="number"
            min="0"
            placeholder="Max"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="min-w-0 flex-1"
            aria-label="Maximum price"
          />
        </div>
        {priceRangeInvalid && (
          <p className="mt-2 text-xs text-[var(--color-danger-700)]" role="alert">
            Enter non-negative prices with a minimum no greater than the maximum.
          </p>
        )}
      </div>

      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase text-[var(--color-gray-500)]">Customer rating</p>
        <div className="space-y-2">
          {[4, 3].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setMinRating(minRating === String(rating) ? '' : String(rating))}
              className="block w-full text-left"
              aria-pressed={minRating === String(rating)}
            >
              <Chip selected={minRating === String(rating)} className="w-full justify-start">
                {rating} stars &amp; up
              </Chip>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase text-[var(--color-gray-500)]">Availability</p>
        <div className="space-y-2">
          {[
            { value: 'true', label: 'In stock' },
            { value: 'false', label: 'Out of stock' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setInStock(inStock === option.value ? '' : option.value)}
              className="block w-full text-left"
              aria-pressed={inStock === option.value}
            >
              <Chip selected={inStock === option.value} className="w-full justify-start">
                {option.label}
              </Chip>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={applyFilters}
          disabled={priceRangeInvalid}
          className="flex-1"
        >
          Apply filters
        </Button>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </>
  );

  const visiblePages = [...new Set([1, page - 2, page - 1, page, page + 1, page + 2, pages])]
    .filter((number) => number >= 1 && number <= pages)
    .sort((left, right) => left - right);

  return (
    <div className="container page py-6">
      <div className="mb-4 lg:hidden">
        <Button variant="secondary" size="sm" onClick={() => setOpenFilters(true)}>
          Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ''}
        </Button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden flex-shrink-0 lg:block lg:w-72">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm">
            <h2 className="mb-6 font-heading text-lg font-bold text-[var(--text-strong)]">Filters</h2>
            {renderFilterContent('desktop')}
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="font-heading text-xl font-bold text-[var(--text-strong)] md:text-2xl">
                All products
              </h1>
              <p className="text-sm text-[var(--color-gray-500)]">{total} products</p>
            </div>
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[var(--color-gray-500)]">Active:</span>
                {activeFilters.map((filter) => (
                  <Chip
                    key={`${filter.key}-${filter.label}`}
                    removable
                    onRemove={() => setParam(filter.key, undefined)}
                  >
                    {filter.label}
                  </Chip>
                ))}
                <Button variant="ghost" size="sm" onClick={clearFilters}>Clear all</Button>
              </div>
            )}
          </div>

          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="hidden md:block">
              <label htmlFor="sortProducts" className="mr-2 text-xs text-[var(--color-gray-500)]">
                Sort by
              </label>
              <select
                id="sortProducts"
                value={query.sort}
                onChange={(event) => setParam('sort', event.target.value)}
                className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm text-[var(--text-body)] focus:border-[var(--color-primary-600)] focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
            <p className="text-xs text-[var(--color-gray-500)]" aria-live="polite">
              Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
          </div>

          {status === 'failed' ? (
            <ErrorState
              message={error || 'Could not load products.'}
              onRetry={() => dispatch(fetchProducts(query))}
            />
          ) : status === 'loading' ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: PAGE_SIZE }, (_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[var(--color-gray-500)]">No products match your filters.</p>
              <Button variant="ghost" onClick={clearFilters} className="mt-4">
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {status !== 'loading' && status !== 'failed' && pages > 1 && (
            <nav className="mt-10 flex items-center gap-2" aria-label="Product pages">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setParam('page', page - 1)}
                aria-label="Previous page"
              >
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
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= pages}
                onClick={() => setParam('page', page + 1)}
                aria-label="Next page"
              >
                ›
              </Button>
            </nav>
          )}
        </main>
      </div>

      {openFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={cancelFilters}
            aria-label="Close filters"
          />
          <section
            className="absolute inset-y-0 right-0 z-10 flex w-full max-w-[90vw] flex-col border-l border-[var(--border)] bg-[var(--bg-card)] shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobileFilterTitle"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <h2 id="mobileFilterTitle" className="font-heading text-lg font-bold text-[var(--text-strong)]">
                Filters
              </h2>
              <button
                type="button"
                onClick={cancelFilters}
                className="rounded-md p-2 text-[var(--text-muted)] hover:bg-[var(--color-gray-100)]"
                aria-label="Close filters"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{renderFilterContent('mobile')}</div>
          </section>
        </div>
      )}
    </div>
  );
}
