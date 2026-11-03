import { useDispatch, useSelector } from 'react-redux';
import { addItem, selectCartQtyByProductId } from '../features/cart/cartSlice.js';
import { PriceTag } from './PriceTag.jsx';
import { StockBadge } from './StockBadge.jsx';
import { Badge } from './Badge.jsx';

export default function ProductCard({ product, showStepper = false }) {
  const dispatch = useDispatch();
  const qty = useSelector((state) => selectCartQtyByProductId(state)(product._id));
  const image = (product.images && product.images[0]) || product.thumbnail || '';
  const onSale = product.discountPercentage && product.discountPercentage > 0;
  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    if (outOfStock) return;
    dispatch(addItem({ product, quantity: 1 }));
  };

  return (
    <article
      className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shadow-sm transition hover:shadow-md group"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
        color: 'var(--text-body)',
      }}
    >
      <div className="relative overflow-hidden aspect-[4/5] bg-[var(--color-gray-100)]">
        {onSale && (
          <Badge variant="discount" className="absolute top-3 left-3 z-10">
            -{product.discountPercentage}%
          </Badge>
        )}
        <img
          src={image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        <StockBadge stock={product.stock} className="absolute bottom-3 left-3 z-20 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md" />
      </div>
      <div className="p-4">
        <Badge variant="neutral" className="text-[10px] uppercase tracking-wide text-[var(--color-gray-500)] border-transparent">
          {product.category}
        </Badge>
        <h3 className="text-sm font-semibold text-[var(--text-strong)] mt-1 line-clamp-2">{product.title}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <PriceTag priceCents={product.priceCents} discountPercentage={product.discountPercentage} />
        </div>
        <div className="mt-3 flex items-center gap-1">
          <span className="text-[var(--color-warning-700)] text-xs font-semibold" aria-label="Rating">
            ★ {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-[var(--color-gray-500)]">({product.reviewCount})</span>
        </div>
        <div className="mt-4">
          {showStepper && qty > 0 ? (
            <div className="flex items-center justify-between">
              <button
                onClick={() => dispatch(addItem({ product, quantity: 0 }))}
                disabled={outOfStock}
                className="w-8 h-8 rounded-pill border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)] text-sm font-bold hover:bg-[var(--color-gray-200)] disabled:opacity-50"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-semibold text-[var(--text-strong)]">{qty} in cart</span>
              <button
                onClick={() => dispatch(addItem({ product, quantity: 1 }))}
                disabled={outOfStock || qty >= product.stock}
                className="w-8 h-8 rounded-pill border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)] text-sm font-bold hover:bg-[var(--color-gray-200)] disabled:opacity-50"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="w-full rounded-md bg-[var(--color-primary-600)] text-white px-4 py-1.5 text-sm font-semibold hover:bg-[var(--color-primary-700)] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
