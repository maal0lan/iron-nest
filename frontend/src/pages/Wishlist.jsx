import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchWishlist } from '../features/wishlist/wishlistSlice.js';
import { addItem } from '../features/cart/cartSlice.js';
import { ProductCard } from '../components/ProductCard.jsx';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ids, status } = useSelector((state) => state.wishlist);
  // In a fuller build, wishlist would be populated with product objects from the API.
  const products = useSelector((state) => state.products.items);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="container page py-6">
      <h1 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-strong)] mb-6">Wishlist</h1>
      {status === 'loading' ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[var(--color-primary-600)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
