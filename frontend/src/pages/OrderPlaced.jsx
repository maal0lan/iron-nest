import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectCartItems } from '../features/cart/cartSlice.js';
import { formatMoney } from '../utils/money.js';

export default function OrderPlaced() {
  const { id } = useParams();
  // In a fuller build we'd fetch the order by id. Here we show a confirmation using cart.
  return (
    <div className="container page py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="rounded-full bg-[var(--color-success-50)] p-6 text-[var(--color-success-700)] inline-block mb-6">
          ✓
        </div>
        <h1 className="font-heading text-3xl font-bold text-[var(--text-strong)] mb-3">Order placed</h1>
        <p className="text-[var(--color-gray-500)] mb-6">
          Thank you for your order! Order ID: <span className="font-semibold text-[var(--text-strong)]">{id}</span>
        </p>
        <p className="text-sm text-[var(--color-gray-500)] mb-8">
          Your order is being processed. You can view it in <a href="/orders" className="text-[var(--color-primary-600)] hover:underline font-semibold">My orders</a>.
        </p>
        <a href="/products" className="rounded-md bg-[var(--color-primary-600)] text-white px-6 py-2 text-sm font-semibold hover:bg-[var(--color-primary-700)] transition inline-block">
          Continue shopping
        </a>
      </div>
    </div>
  );
}
