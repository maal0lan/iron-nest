import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchSellerProducts, fetchSellerOrders, fetchSellerStats,
  createSellerProduct, updateSellerProduct, deleteSellerProduct, updateSellerStock, updateOrderStatus,
} from '../features/seller/sellerSlice.js';
import { formatMoney } from '../utils/money.js';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { StockBadge } from '../components/StockBadge.jsx';
import { Badge } from '../components/Badge.jsx';

const CATEGORIES = ['supplements', 'equipment', 'apparel', 'footwear', 'accessories', 'recovery'];

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const { products, orders, stats, status } = useSelector((state) => state.seller);
  const [activeTab, setActiveTab] = useState('products');
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'supplements', subCategory: '', brand: '',
    priceCents: '', discountPercentage: '0', stock: '', images: '', tags: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchSellerProducts());
    dispatch(fetchSellerOrders());
    dispatch(fetchSellerStats());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      subCategory: form.subCategory,
      brand: form.brand,
      priceCents: Number(form.priceCents) * 100,
      discountPercentage: Number(form.discountPercentage) || 0,
      stock: Number(form.stock) || 0,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
    };
    if (editId) {
      dispatch(updateSellerProduct({ id: editId, data: payload }));
    } else {
      dispatch(createSellerProduct(payload));
    }
    setOpenForm(false);
    setEditId(null);
    setForm({ title: '', description: '', category: 'supplements', subCategory: '', brand: '', priceCents: '', discountPercentage: '0', stock: '', images: '', tags: '' });
  };

  return (
    <div className="container page py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-strong)] mb-1">Seller dashboard</h1>
          <p className="text-sm text-[var(--color-gray-500)]">Manage your shop and orders</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ title: '', description: '', category: 'supplements', subCategory: '', brand: '', priceCents: '', discountPercentage: '0', stock: '', images: '', tags: '' }); setOpenForm(true); }} className="rounded-md bg-[var(--color-primary-600)] text-white px-4 py-2 text-sm font-semibold hover:bg-[var(--color-primary-700)] transition">
          + Add product
        </Button>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[stats.productCount, stats.orderCount, null, stats.revenueCents].map((val, i) => {
            const labels = ['Products', 'Orders', 'Top product', 'Revenue'];
            const values = [stats.productCount, stats.orderCount, stats.topProduct?.title || '—', stats.revenueCents !== undefined ? formatMoney(stats.revenueCents) : '$0'];
            return (
              <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm">
                <p className="text-xs text-[var(--color-gray-500)] uppercase font-semibold">{labels[i]}</p>
                <p className="text-lg font-bold text-[var(--text-strong)]">{values[i]}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {['products', 'orders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-200)]'
                : 'text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]'
            }`}
          >
            {tab === 'products' ? 'My products' : 'Orders'}
          </button>
        ))}
      </div>

      {activeTab === 'products' ? (
        <ProductsTab({ products, dispatch, openForm, setOpenForm, form, setForm, editId, setEditId, handleSubmit, CATEGORIES }) || <ProductsTab />}
      ) : (
        <OrdersTab orders={orders} dispatch={dispatch} />
      )}
    </div>
  );
}

function ProductsTab({ products, dispatch, openForm, setOpenForm, form, setForm, editId, setEditId, handleSubmit, CATEGORIES }) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-sm text-center">
        <p className="text-[var(--color-gray-500)]">No products yet. Add your first product.</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--color-gray-50)]">
            <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Product</th>
            <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Price</th>
            <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Stock</th>
            <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-[var(--border)]">
              <td className="px-6 py-3">
                <div className="flex items-center gap-3">
                  <img src={(p.images && p.images[0]) || p.thumbnail || ''} alt={p.title} className="w-10 h-10 rounded object-cover bg-[var(--color-gray-100)]" />
                  <span className="text-[var(--text-body)]">{p.title}</span>
                </div>
              </td>
              <td className="px-6 py-3 text-[var(--text-strong)]">{formatMoney(p.priceCents)}</td>
              <td className="px-6 py-3"><StockBadge stock={p.stock} /></td>
              <td className="px-6 py-3 flex gap-2">
                <button
                  onClick={() => { setEditId(p._id); setForm({ title: p.title || '', description: p.description || '', category: p.category, subCategory: p.subCategory || '', brand: p.brand || '', priceCents: (p.priceCents / 100).toString(), discountPercentage: (p.discountPercentage || 0).toString(), stock: p.stock.toString(), images: (p.images || []).join(', '), tags: (p.tags || []).join(', ') }); setOpenForm(true); }}
                  className="text-xs text-[var(--color-primary-600)] hover:underline font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteSellerProduct(p._id))}
                  className="text-xs text-[var(--color-danger-700)] hover:underline font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersTab({ orders, dispatch }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-sm text-center">
        <p className="text-[var(--color-gray-500)]">No orders yet.</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--color-gray-50)]">
            <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Order</th>
            <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Customer</th>
            <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Items</th>
            <th className="px-6 py-3 text-[var(--color-gray-500)] font-semibold text-xs uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-[var(--border)]">
              <td className="px-6 py-3 text-[var(--text-body)]">#{o._id.slice(-6)}</td>
              <td className="px-6 py-3 text-[var(--color-gray-500)]">{o.items[0]?.title || '—'}</td>
              <td className="px-6 py-3 text-[var(--color-gray-500)]">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
              <td className="px-6 py-3">
                <select
                  value={o.status}
                  onChange={(e) => dispatch(updateOrderStatus({ id: o._id, status: e.target.value }))}
                  className="rounded-md border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-body)] px-3 py-1 text-xs focus:border-[var(--color-primary-600)] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
