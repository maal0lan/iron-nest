import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from '../components/ProductCard.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { fetchWishlist } from '../features/wishlist/wishlistSlice.js';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.wishlist);

  return (
    <div className="container page py-6">
      <h1 className="page-title mb-6">Wishlist</h1>
      {status === 'loading' ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[var(--color-primary-600)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : status === 'failed' ? (
        <ErrorState message={error || 'Could not load your wishlist.'} onRetry={() => dispatch(fetchWishlist())} />
      ) : (
        <div className="grid grid-cols-2 gap-[var(--grid-gap)] sm:grid-cols-3 lg:grid-cols-4">
          {products.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-[var(--color-gray-500)]">Your wishlist is empty.</p>
            </div>
          )}
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
