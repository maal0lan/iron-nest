import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../features/products/productsSlice.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { Chip } from '../components/Chip.jsx';
import { Badge } from '../components/Badge.jsx';
import { StockBadge } from '../components/StockBadge.jsx';
import { Input } from '../components/Input.jsx';
import { Button } from '../components/Button.jsx';

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

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [openFilters, setOpenFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');

  const { items, total, page, pages, status, error, categories } = useSelector((state) => state.products);

  const query = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    subCategory: searchParams.get('subCategory') || undefined,
    search: searchParams.get('search') || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    minRating: minRating || undefined,
    inStock: searchParams.get('inStock') === 'true' ? true : searchParams.get('inStock') === 'false' ? false : undefined,
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  }), [searchParams, minPrice, maxPrice, minRating]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts(query));
  }, [dispatch, query]);

  const activeFilters = [];
  if (query.category) activeFilters.push({ label: CATEGORY_LABELS[query.category] || query.category, key: 'category' });
  if (query.subCategory) activeFilters.push({ label: query.subCategory, key: 'subCategory' });
  if (query.search) activeFilters.push({ label: `Search: ${query.search}`, key: 'search' });
  if (query.minPrice) activeFilters.push({ label: `Min $${query.minPrice}`, key: 'minPrice' });
  if (query.maxPrice) activeFilters.push({ label: `Max $${query.maxPrice}`, key: 'maxPrice' });
  if (query.minRating) activeFilters.push({ label: `${query.minRating}+ stars`, key: 'minRating' });

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === undefined || value === '') params.delete(key);
    else params.set(key, value);
    params.set('page', '1');
    setSearchParams(params);
  };

  if (status === 'loading') {
    return (
      <div className="container page py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-sm overflow-hidden">
              <div className="aspect-[4/5] bg-[var(--color-gray-200)] animate-pulse" />
              <div className="p-4">
                <div className="h-4 bg-[var(--color-gray-200)] rounded w-3/4 animate-pulse mb-2" />
                <div className="h-4 bg-[var(--color-gray-200)] rounded w-full animate-pulse" />
                <div className="h-4 bg-[var(--color-gray-200)] rounded w-1/2 animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container page py-20">
        <ErrorState message={error || 'Could not load products.'} onRetry={() => dispatch(fetchProducts(query))} />
      </div>
    );
  }

  return (
    <div className="container page py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter sidebar */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className={`rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm ${openFilters ? '' : 'hidden lg:block'}`}>
            <h3 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-6">Filters</h3>
            <button onClick={() => setOpenFilters(false)} className="text-xs font-semibold text-[var(--color-primary-600)] hover:underline mb-4 block">Clear all</button>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-[var(--color-gray-500)] uppercase mb-3">Category</label>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const selected = query.category === cat;
                  return (
                    <Chip
                      key={cat}
                      selected={selected}
                      onRemove={() => setParam('category', undefined)}
                      onClick={() => setParam('category', cat)}
                      className="cursor-pointer w-full justify-start"
                    >
                      {CATEGORY_LABELS[cat]}
                    </Chip>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-[var(--color-gray-500)] uppercase mb-3">Price</label>
              <div className="flex gap-3">
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="flex-1 min-w-0"
                />
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="flex-1 min-w-0"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-[var(--color-gray-500)] uppercase mb-3">Customer rating</label>
              <div className="space-y-2">
                {[4, 3].map((rating) => {
                  const selected = query.minRating === String(rating);
                  return (
                    <Chip
                      key={rating}
                      selected={selected}
                      onRemove={() => setParam('minRating', undefined)}
                      onClick={() => setParam('minRating', String(rating))}
                      className="cursor-pointer w-full justify-start"
                    >
                      {rating} stars & up
                    </Chip>
                  );
                })}
                <Chip
                  selected={!query.minRating}
                  onRemove={() => setParam('minRating', undefined)}
                  onClick={() => setParam('minRating', undefined)}
                  className="cursor-pointer w-full justify-start"
                >
                  Any rating
                </Chip>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-[var(--color-gray-500)] uppercase mb-3">Availability</label>
              <div className="space-y-2">
                <Chip
                  selected={query.inStock === true}
                  onRemove={() => setParam('inStock', undefined)}
                  onClick={() => setParam('inStock', 'true')}
                  className="cursor-pointer w-full justify-start"
                >
                  In stock
                </Chip>
                <Chip
                  selected={query.inStock === false}
                  onRemove={() => setParam('inStock', 'false')}
                  onClick={() => setParam('inStock', 'false')}
                  className="cursor-pointer w-full justify-start"
                >
                  Out of stock
                </Chip>
              </div>
            </div>

            <Button variant="primary" size="sm" onClick={() => navigate(location.pathname + '?' + new URLSearchParams({
              ...Object.fromEntries(searchParams),
              minPrice, maxPrice, minRating,
              page: '1',
            }).toString())} className="w-full">
              Apply filters
            </Button>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-strong)]">All products</h1>
              <p className="text-[var(--color-gray-500)] text-sm">{total} products</p>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-[var(--color-gray-500)]">Active:</span>
                {activeFilters.map((f) => (
                  <Chip key={`${f.label}-${f.key}`} removable onRemove={() => setParam(f.key, undefined)}>
                    {f.label}
                  </Chip>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="hidden md:block">
              <label className="text-xs text-[var(--color-gray-500)] mr-2">Sort by</label>
              <select
                value={query.sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)] px-3 py-1.5 text-sm focus:border-[var(--color-primary-600)] focus:outline-none"
              >
                <option value="newest">Featured</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
            <div className="text-xs text-[var(--color-gray-500)]">
              Showing {((page - 1) * 12) + 1} to {Math.min(page * 12, total)} of {total}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {items.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-[var(--color-gray-500)]">No products match your filters.</p>
              <Button variant="ghost" onClick={() => setSearchParams(new URLSearchParams())} className="mt-4">
                Clear all filters
              </Button>
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
