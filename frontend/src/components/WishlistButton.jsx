import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addToWishlist, removeFromWishlist } from '../features/wishlist/wishlistSlice.js';

function WishlistButton({ product, className = '' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const ids = useSelector((state) => state.wishlist.ids);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isSaved = ids.includes(product._id);

  const handleClick = async () => {
    if (!token) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setBusy(true);
    setError('');
    try {
      if (isSaved) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
      } else {
        await dispatch(addToWishlist({ productId: product._id, product })).unwrap();
      }
    } catch (requestError) {
      setError(requestError.message || 'Could not update your wishlist.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-label={isSaved ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        aria-pressed={isSaved}
        title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
        className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-[var(--color-danger-700)] shadow-sm transition hover:scale-105 hover:bg-[var(--color-danger-50)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--color-focus-ring)] disabled:cursor-wait disabled:opacity-60"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill={isSaved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
      </button>
      {error && (
        <span role="alert" className="absolute right-0 top-full mt-1 w-48 rounded-md bg-[var(--color-danger-50)] p-2 text-xs text-[var(--color-danger-700)] shadow">
          {error}
        </span>
      )}
    </div>
  );
}

export { WishlistButton };
export default WishlistButton;
