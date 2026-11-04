import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchOrderById } from '../features/orders/ordersSlice.js';
import { formatMoney } from '../utils/money.js';

export default function OrderPlaced() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.current?._id === id ? state.orders.current : null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order) {
      setLoading(false);
      return;
    }

    setLoading(true);
    dispatch(fetchOrderById(id))
      .unwrap()
      .catch(() => setError('We could not load this order. Please check My orders.'))
      .finally(() => setLoading(false));
  }, [dispatch, id, order]);

  if (loading) {
    return (
      <div className="container page py-20 flex justify-center" role="status" aria-label="Loading order">
        <div className="w-8 h-8 border-4 border-[var(--color-primary-600)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container page py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-[var(--text-strong)] mb-3">Order confirmation unavailable</h1>
        <p className="text-[var(--color-gray-500)] mb-6">{error || 'This order could not be found.'}</p>
        <Link to="/orders" className="text-[var(--color-primary-600)] font-semibold hover:underline">Go to My orders</Link>
      </div>
    );
  }

  return (
    <div className="container page py-10 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="rounded-full bg-[var(--color-success-50)] p-5 text-[var(--color-success-700)] inline-block mb-5" aria-hidden="true">
            ✓
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-success-700)] mb-2">Purchase complete</p>
          <h1 className="font-heading text-3xl font-bold text-[var(--text-strong)] mb-3">Thank you for your order</h1>
          <p className="text-[var(--color-gray-500)]">
            Order <span className="font-semibold text-[var(--text-strong)]">#{order._id.slice(-6)}</span> is confirmed.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_260px]">
          <section className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] p-5 md:p-6">
            <h2 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-5">Order summary</h2>
            <ul className="divide-y divide-[var(--border)]">
              {order.items.map((item) => (
                <li key={item._id || `${item.product}-${item.title}`} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  {item.image && (
                    <img src={item.image} alt="" className="w-16 h-16 rounded object-cover bg-[var(--color-gray-50)]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--text-strong)]">{item.title}</p>
                    <p className="text-sm text-[var(--color-gray-500)]">Qty {item.quantity} · {formatMoney(item.unitPriceCents)} each</p>
                  </div>
                  <p className="font-semibold text-[var(--text-strong)]">{formatMoney(item.unitPriceCents * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-[var(--color-gray-500)]">Subtotal</dt><dd>{formatMoney(order.subtotalCents)}</dd></div>
              {order.discountCents > 0 && <div className="flex justify-between"><dt className="text-[var(--color-gray-500)]">Discount</dt><dd>-{formatMoney(order.discountCents)}</dd></div>}
              <div className="flex justify-between"><dt className="text-[var(--color-gray-500)]">Shipping</dt><dd>{formatMoney(order.shippingCents)}</dd></div>
              <div className="flex justify-between border-t border-[var(--border)] pt-3 text-base font-bold text-[var(--text-strong)]"><dt>Total</dt><dd>{formatMoney(order.totalCents)}</dd></div>
            </dl>
          </section>

          <aside className="space-y-5">
            <section className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] p-5">
              <h2 className="font-heading font-bold text-[var(--text-strong)] mb-3">Delivering to</h2>
              <p className="font-semibold text-[var(--text-strong)]">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-[var(--color-gray-500)]">{order.shippingAddress.line1}</p>
              <p className="text-sm text-[var(--color-gray-500)]">{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
              <p className="text-sm text-[var(--color-gray-500)]">{order.shippingAddress.phone}</p>
            </section>
            <p className="text-sm text-[var(--color-gray-500)]">
              Status: <span className="font-semibold capitalize text-[var(--text-strong)]">{order.status}</span>
            </p>
            <Link to="/orders" className="block rounded-md border border-[var(--border)] px-4 py-3 text-center text-sm font-semibold text-[var(--text-strong)] hover:bg-[var(--color-gray-50)] transition">
              View my orders
            </Link>
            <Link to="/products" className="block rounded-md bg-[var(--color-primary-600)] px-4 py-3 text-center text-sm font-semibold text-[var(--on-primary)] hover:bg-[var(--color-primary-700)] transition">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
