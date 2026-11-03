import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { fetchProductById, fetchRelated, clearProduct } from '../features/products/productsSlice.js';
import { addItem, selectCartQtyByProductId } from '../features/cart/cartSlice.js';
import { PriceTag } from '../components/PriceTag.jsx';
import { StockBadge } from '../components/StockBadge.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { formatMoney } from '../utils/money.js';

export default function ProductDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { current, related, status, error } = useSelector((state) => state.products);
  const qty = useSelector((state) => selectCartQtyByProductId(state)(id || ''));

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchRelated(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  if (status === 'loading') {
    return (
      <div className="container page py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="aspect-[4/5] rounded-xl bg-[var(--color-gray-200)] animate-pulse overflow-hidden" />
          </div>
          <div className="lg:col-span-5">
            <div className="h-4 bg-[var(--color-gray-200)] rounded w-3/4 animate-pulse mb-4" />
            <div className="h-32 bg-[var(--color-gray-200)] rounded animate-pulse" />
            <div className="h-4 bg-[var(--color-gray-200)] rounded w-full animate-pulse mt-6" />
            <div className="h-4 bg-[var(--color-gray-200)] rounded w-1/2 animate-pulse mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed' || !current) {
    return (
      <div className="container page py-20">
        <ErrorState message={error || 'Product not found.'} onRetry={() => dispatch(fetchProductById(id))} />
      </div>
    );
  }

  const product = current;
  const image = (product.images && product.images[0]) || product.thumbnail || '';
  const onSale = product.discountPercentage && product.discountPercentage > 0;
  const outOfStock = product.stock === 0;
  const discounted = Math.round(product.priceCents * (1 - (product.discountPercentage || 0) / 100));
  const saved = product.priceCents - discounted;
  const inCartQty = qty;

  const handleAdd = (q = 1) => {
    if (outOfStock) return;
    dispatch(addItem({ product, quantity: q }));
  };

  return (
    <div className="container page py-6">
      <BreadcrumbItems product={product} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shadow-sm">
            {onSale && (
              <Badge variant="discount" className="absolute top-4 left-4 z-10">-{product.discountPercentage}%</Badge>
            )}
            <img src={image} alt={product.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="mt-4 flex gap-3 overflow-hidden">
            {(product.images || []).slice(0, 4).map((img, i) => (
              <button
                key={i}
                className="flex-shrink-0 w-16 h-16 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden"
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div>
            <Badge variant="neutral" className="text-[10px] uppercase tracking-wide text-[var(--color-gray-500)] border-transparent">{product.category}</Badge>
            <StockBadge stock={product.stock} className="mt-2" />
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-strong)] mb-2">{product.title}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[var(--color-warning-700)] text-xs font-semibold">★ {product.rating.toFixed(1)}</span>
              <span className="text-xs text-[var(--color-gray-500)]">{product.reviewCount} reviews</span>
              <span className="text-xs text-[var(--color-gray-500)]">· Brand: {product.brand}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-[var(--color-primary-600)] text-4xl md:text-5xl font-bold font-heading">{formatMoney(discounted)}</span>
            {onSale && (
              <>
                <span className="text-[var(--color-gray-500)] line-through">{formatMoney(product.priceCents)}</span>
                <span className="text-[var(--color-success-700)] text-xs font-semibold">You save {formatMoney(saved)}</span>
              </>
            )}
          </div>

          <div className="mb-4">
            <p className="text-[var(--text-body)] leading-relaxed">{product.description}</p>
            {product.tags && product.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="primary" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-[var(--text-strong)]">Quantity</span>
              <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
                <button
                  onClick={() => handleAdd(-1)}
                  disabled={inCartQty <= 1 || outOfStock}
                  className="w-8 h-8 rounded-l-md border-r-0 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)] text-sm font-bold hover:bg-[var(--color-gray-200)] disabled:opacity-50"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold text-[var(--text-strong)]">{inCartQty}</span>
                <button
                  onClick={() => handleAdd(1)}
                  disabled={inCartQty >= product.stock || outOfStock}
                  className="w-8 h-8 rounded-r-md border-l-0 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)] text-sm font-bold hover:bg-[var(--color-gray-200)] disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleAdd(1)}
                disabled={outOfStock || inCartQty >= product.stock}
                className="w-full rounded-md bg-[var(--color-primary-600)] text-white px-6 py-3 text-lg font-semibold hover:bg-[var(--color-primary-700)] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {outOfStock ? 'Out of stock' : 'Add to cart'}
              </button>
              <Link to="/cart" className="mt-3 w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-strong)] px-6 py-3 text-lg font-semibold hover:bg-[var(--color-gray-100)] transition block text-center">
                Buy now
              </Link>
            </div>
          </div>

          <div className="bg-[var(--color-success-50)] border border-[var(--color-success-50)] rounded-lg p-4 text-xs text-[var(--color-success-700)]">
            Free shipping on orders of $50 or more · 30-day returns
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-8 mb-6 border-b border-[var(--border)]">
          <button className="pb-4 border-b-2 border-[var(--color-primary-600)] text-[var(--color-primary-600)] font-semibold">Description</button>
          <button className="pb-4 border-b-2 border-transparent text-[var(--color-gray-500)] font-semibold hover:text-[var(--text-strong)]">Specifications</button>
          <button className="pb-4 border-b-2 border-transparent text-[var(--color-gray-500)] font-semibold hover:text-[var(--text-strong)]">Reviews ({product.reviewCount})</button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[var(--text-body)] leading-relaxed">{product.description}</p>
            {product.tags && product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-[var(--color-gray-500)] uppercase">Tags</span>
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="primary" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-4">Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {(product.specifications || []).map((spec, i) => (
                <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3 shadow-sm">
                  <p className="text-xs text-[var(--color-gray-500)] uppercase font-semibold">{spec.label}</p>
                  <p className="text-sm text-[var(--text-body)]">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-4">Reviews ({product.reviewCount})</h3>
            <div className="space-y-4">
              {(product.reviews || []).slice(0, 3).map((review, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-[var(--text-strong)]">{review.name}</span>
                    <span className="text-[var(--color-warning-700)] text-xs font-semibold">★ {review.rating}</span>
                  </div>
                  <p className="text-sm text-[var(--text-body)]">{review.comment}</p>
                </div>
              ))}
              {product.reviewCount === 0 && <p className="text-[var(--color-gray-500)] text-sm">No reviews yet.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      <div className="mt-16">
        <h3 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-6">You may also like</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {related.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BreadcrumbItems({ product }) {
  return (
    <div className="mb-6 flex items-center gap-2 text-sm text-[var(--color-gray-500)]">
      <Link to="/" className="hover:text-[var(--color-primary-600)]">Home</Link>
      <span>/</span>
      <Link to={`/products?category=${product.category}`} className="hover:text-[var(--color-primary-600)]">{CATEGORY_LABELS[product.category] || product.category}</Link>
      <span>/</span>
      <span className="text-[var(--text-strong)]" aria-current="page">{product.title}</span>
    </div>
  );
}

const CATEGORY_LABELS = {
  supplements: 'Supplements',
  equipment: 'Equipment',
  apparel: 'Apparel',
  footwear: 'Footwear',
  accessories: 'Accessories',
  recovery: 'Recovery',
};
