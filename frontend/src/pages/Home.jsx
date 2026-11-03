import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../features/products/productsSlice.js';
import { ProductCard } from '../components/ProductCard.jsx';
import { Skeleton } from '../components/Skeleton.jsx';

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ sort: 'featured', limit: 8 }));
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="container page py-6">
        <div className="flex gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-sm overflow-hidden">
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

  if (error) {
    return (
      <div className="container page py-20 text-center">
        <p className="text-[var(--color-danger-700)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="container page py-6">
      <section className="rounded-xl bg-[var(--color-primary-50)] p-8 md:p-12 mb-10 overflow-hidden relative" style={{ color: '#1e1b4b' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-600)]">This week only</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-[var(--text-strong)] mb-3 leading-tight">
              Train harder, save smarter
            </h1>
            <p className="text-[var(--text-body)] mb-6 max-w-md">
              Use code <strong>SAVE10</strong> for 10% off your cart. Free shipping on orders of $50 or more.
            </p>
            <Link to="/products" className="rounded-md bg-[var(--color-primary-600)] text-white px-6 py-2 text-sm font-semibold hover:bg-[var(--color-primary-700)] transition inline-block">
              Shop deals
            </Link>
          </div>
          <div className="hidden md:block w-1/3">
            <div className="aspect-[4/5] rounded-lg bg-[var(--color-gray-200)] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534438327275-194e9ad50e25?w=600&q=80" alt="Gym gear" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-strong)] mb-6">Featured</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {items.length === 0 && status === 'succeeded' && (
          <p className="text-[var(--color-gray-500)]">No featured products.</p>
        )}
      </section>
    </div>
  );
}
