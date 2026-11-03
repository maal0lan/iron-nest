import { useDispatch, useSelector } from 'react-redux';
import { increase, decrease, removeItem, selectCartQtyByProductId } from '../features/cart/cartSlice.js';

export default function QtyStepper({ productId, stock, className }) {
  const dispatch = useDispatch();
  const qty = useSelector((state) => selectCartQtyByProductId(state)(productId));

  return (
    <div className={`inline-flex items-center gap-1 rounded-pill border border-[var(--border)] ${className || ''}`}>
      <button
        onClick={() => dispatch(decrease(productId))}
        disabled={qty <= 1}
        className="w-8 h-8 rounded-l-md border-r-0 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)] text-sm font-bold hover:bg-[var(--color-gray-200)] disabled:opacity-50"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold text-[var(--text-strong)]">{qty}</span>
      <button
        onClick={() => dispatch(increase(productId))}
        disabled={qty >= stock}
        className="w-8 h-8 rounded-r-md border-l-0 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)] text-sm font-bold hover:bg-[var(--color-gray-200)] disabled:opacity-50"
      >
        +
      </button>
      <button
        onClick={() => dispatch(removeItem(productId))}
        className="ml-2 text-xs text-[var(--color-danger-700)] hover:text-[var(--color-danger-700)] underline"
      >
        Remove
      </button>
    </div>
  );
}
