import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats, fetchAdminSellers } from '../features/admin/adminSlice.js';
import { formatMoney } from '../utils/money.js';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, sellers, status } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAdminSellers());
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
      <h1 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-strong)] mb-6">Admin dashboard</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total revenue" value={formatMoney(stats.totalRevenueCents || 0)} icon="¥" />
          <StatCard title="Total orders" value={stats.totalOrders || 0} icon="🧾" />
          <StatCard title="Total users" value={stats.totalUsers || 0} icon="👤" />
          <StatCard title="Top categories" value={stats.topCategories?.length || 0} icon="📂" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-4">Top products</h2>
          <div className="space-y-3">
            {(stats?.topProducts || []).map((p, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-body)]">{p.title || 'Product'}</span>
                <span className="text-[var(--color-gray-500)] font-mono">{p.count || 0} sold</span>
              </div>
            ))}
            {stats?.topProducts?.length === 0 && <p className="text-[var(--color-gray-500)] text-sm">No data yet.</p>}
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-4">Sellers</h2>
          <div className="space-y-3">
            {(sellers || []).map((s) => (
              <div key={s.id} className="flex justify-between items-center text-sm border-b border-[var(--border)] pb-2 last:border-0 last:pb-0">
                <div>
                  <div className="text-[var(--text-strong)] font-semibold">{s.name}</div>
                  <div className="text-[var(--color-gray-500)] text-xs">{s.shopName}</div>
                </div>
                <div className="text-right">
                  <div className="text-[var(--text-body)]">{formatMoney(s.totalSalesCents || 0)}</div>
                  <div className="text-[var(--color-gray-500)] text-xs">{s.productCount} products</div>
                </div>
              </div>
            ))}
            {sellers?.length === 0 && <p className="text-[var(--color-gray-500)] text-sm">No sellers yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-[var(--color-gray-500)] uppercase font-semibold">{title}</p>
        <p className="text-lg font-bold text-[var(--text-strong)]">{value}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-[var(--color-primary-50)] flex items-center justify-center text-[var(--color-primary-600)] text-lg">
        {icon}
      </div>
    </div>
  );
}
