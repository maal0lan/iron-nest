import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/orders/ordersSlice.js';
import { formatMoney } from '../utils/money.js';

export default function MyOrders() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="container page py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-primary-600)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container page py-6">
      <h1 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-strong)] mb-6">My orders</h1>
      {list.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[var(--color-gray-500)]">No orders yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--color-gray-50)]">
                <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Order</th>
                <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Date</th>
                <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Items</th>
                <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Status</th>
                <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              {list.map((order) => (
                <tr key={order._id} className="border-b border-[var(--border)]">
                  <td className="px-6 py-3 text-[var(--text-body)]">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-3 text-[var(--color-gray-500)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-[var(--color-gray-500)]">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-[var(--color-success-50)] text-[var(--color-success-700)]'
                          : order.status === 'shipped'
                          ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
                          : 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)]'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[var(--text-strong)] font-semibold">{formatMoney(order.totalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
