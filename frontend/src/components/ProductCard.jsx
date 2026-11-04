import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItem, increase, decrease, selectCartQtyByProductId } from '../features/cart/cartSlice.js';
import { PriceTag } from './PriceTag.jsx';
import { StockBadge } from './StockBadge.jsx';
import { Badge } from './Badge.jsx';
import { WishlistButton } from './WishlistButton.jsx';

function ProductCard({ product, showStepper = true }) {
  const dispatch = useDispatch();
  const qty = useSelector((state) => selectCartQtyByProductId(state)(product._id));
  const image = (product.images && product.images[0]) || product.thumbnail || '';
  const onSale = Number(product.discountPercentage) > 0;
  const outOfStock = product.stock === 0;
  const rating = Number(product.rating || 0);

  const handleAdd = () => {
    if (outOfStock) return;
    dispatch(addItem({ product, quantity: 1 }));
  };

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg border bg-[var(--bg-card)] shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md ${
        qty > 0 ? 'border-[var(--color-primary-600)]' : 'border-[var(--border)] hover:border-[var(--color-primary-200)]'
      }`}
    >
      <WishlistButton product={product} className="absolute right-3 top-3 z-20" />
      <Link to={`/product/${product._id}`} className="relative block aspect-[4/5] overflow-hidden bg-[var(--color-gray-100)]" aria-label={product.title}>
        {onSale && (
          <Badge variant="discount" className="absolute left-3 top-3 z-10 shadow-sm">
            -{product.discountPercentage}%
          </Badge>
        )}
        {image && (
          <img
            src={image}
            alt={product.title}
            className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${outOfStock ? 'grayscale opacity-60' : ''}`}
            loading="lazy"
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        {product.stock < 10 && <StockBadge stock={product.stock} className="absolute bottom-3 left-3 z-10 shadow-sm" />}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase leading-4 tracking-wider text-[var(--text-muted)]">{product.category}</span>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] font-body text-sm font-semibold leading-5 text-[var(--text-strong)]">
          <Link to={`/product/${product._id}`} className="hover:text-[var(--color-primary-600)] transition-colors">{product.title}</Link>
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-[var(--color-warning-700)]" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>★ {rating.toFixed(1)}</span>
          {product.reviewCount != null && <span className="text-[var(--text-muted)]">({product.reviewCount})</span>}
        </div>

        <div className="mt-2">
          <PriceTag priceCents={product.priceCents} discountPercentage={product.discountPercentage} compact />
        </div>

        <div className="mt-auto pt-4">
          {showStepper && qty > 0 ? (
            <div className="flex min-h-[var(--control-md)] items-center justify-between rounded-pill border border-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-1.5">
              <button
                type="button"
                onClick={() => dispatch(decrease(product._id))}
                aria-label="Decrease quantity"
                className="grid h-8 w-8 place-items-center rounded-full text-base font-bold text-[var(--color-primary-600)] transition-colors hover:bg-[var(--color-primary-100)]"
              >
                −
              </button>
              <span className="text-sm font-semibold text-[var(--text-strong)]">{qty} in cart</span>
              <button
                type="button"
                onClick={() => dispatch(increase(product._id))}
                disabled={qty >= product.stock}
                aria-label="Increase quantity"
                className="grid h-8 w-8 place-items-center rounded-full text-base font-bold text-[var(--color-primary-600)] transition-colors hover:bg-[var(--color-primary-100)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock}
              className="inline-flex min-h-[var(--control-md)] w-full items-center justify-center rounded-md bg-[var(--color-primary-600)] px-4 text-sm font-semibold text-[var(--on-primary)] transition-all duration-150 hover:bg-[var(--color-primary-700)] hover:shadow-glow disabled:cursor-not-allowed disabled:bg-[var(--color-gray-200)] disabled:text-[var(--text-muted)] disabled:shadow-none"
            >
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export { ProductCard };
export default ProductCard;
