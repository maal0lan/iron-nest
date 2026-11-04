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
import { StatCard } from '../components/StatCard.jsx';

const CATEGORIES = ['supplements', 'equipment', 'apparel', 'footwear', 'accessories', 'recovery'];

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const { products, orders, stats, status } = useSelector((state) => state.seller);
  const [activeTab, setActiveTab] = useState('products');
  const [openForm, setOpenForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
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

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    dispatch(deleteSellerProduct(id));
    setConfirmDeleteId(null);
  };

  const handleSetStock = (id, currentStock) => {
    const next = window.prompt(`Set new stock (current: ${currentStock}):`);
    if (next === null) return;
    const stock = Number(next);
    if (!Number.isFinite(stock) || stock < 0) {
      window.alert('Please enter a valid non-negative number.');
      return;
    }
    dispatch(updateSellerStock({ id, stock }));
  };

  return (
    <div className="container page py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title mb-1">Seller dashboard</h1>
          <p className="page-subtitle">Manage your shop and orders</p>
        </div>
        <Button onClick={() => { setEditId(null); setForm({ title: '', description: '', category: 'supplements', subCategory: '', brand: '', priceCents: '', discountPercentage: '0', stock: '', images: '', tags: '' }); setOpenForm(true); }} className="w-full md:w-auto">
          + Add product
        </Button>
      </div>

      {/* Add / Edit product form */}
      {openForm && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm mb-8">
          <h2 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-4">
            {editId ? 'Edit product' : 'Add product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold uppercase text-[var(--color-gray-500)] mb-1">Title</label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold uppercase text-[var(--color-gray-500)] mb-1">Description</label>
              <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold uppercase text-[var(--color-gray-500)] mb-1">Category</label>
              <select id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="min-h-[var(--control-md)] w-full rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm text-[var(--text-body)] focus:border-[var(--color-primary-600)] focus:outline-none">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold uppercase text-[var(--color-gray-500)] mb-1">Brand</label>
              <Input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div className="sm:col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold uppercase text-[var(--color-gray-500)] mb-1">Price (₹)</label>
              <Input id="priceCents" type="number" min="0" value={form.priceCents} onChange={(e) => setForm({ ...form, priceCents: e.target.value })} required />
            </div>
            <div className="sm:col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold uppercase text-[var(--color-gray-500)] mb-1">Discount %</label>
              <Input id="discountPercentage" type="number" min="0" max="100" value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} />
            </div>
            <div className="sm:col-span-1 lg:col-span-1">
              <label className="block text-xs font-semibold uppercase text-[var(--color-gray-500)] mb-1">Stock</label>
              <Input id="stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold uppercase text-[var(--color-gray-500)] mb-1">Images (comma separated)</label>
              <Input id="images" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="url1, url2" />
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold uppercase text-[var(--color-gray-500)] mb-1">Tags (comma separated)</label>
              <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="tag1, tag2" />
            </div>
            <div className="sm:col-span-2 lg:col-span-2 flex gap-2">
              <Button type="button" variant="ghost" onClick={() => { setOpenForm(false); setEditId(null); setForm({ title: '', description: '', category: 'supplements', subCategory: '', brand: '', priceCents: '', discountPercentage: '0', stock: '', images: '', tags: '' }); }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {editId ? 'Save changes' : 'Create product'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[stats.productCount, stats.orderCount, null, stats.revenueCents].map((val, i) => {
            const labels = ['Products', 'Orders', 'Top product', 'Revenue'];
            const values = [stats.productCount, stats.orderCount, stats.topProduct?.title || '—', stats.revenueCents !== undefined ? formatMoney(stats.revenueCents) : formatMoney(0)];
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
        <ProductsTab
          products={products}
          dispatch={dispatch}
          openForm={openForm}
          setOpenForm={setOpenForm}
          form={form}
          setForm={setForm}
          editId={editId}
          setEditId={setEditId}
          handleSubmit={handleSubmit}
          CATEGORIES={CATEGORIES}
          handleDelete={handleDelete}
          handleSetStock={handleSetStock}
        />
      ) : (
        <OrdersTab orders={orders} dispatch={dispatch} />
      )}
    </div>
  );
}

function ProductsTab({ products, dispatch, openForm, setOpenForm, form, setForm, editId, setEditId, handleSubmit, CATEGORIES, handleDelete, handleSetStock }) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-sm text-center">
        <p className="text-[var(--color-gray-500)]">No products yet. Add your first product.</p>
      </div>
    );
  }
  return (
    <div className="table-scroll rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
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
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <StockBadge stock={p.stock} />
                  <button
                    type="button"
                    onClick={() => handleSetStock(p._id, p.stock)}
                    className="text-xs text-[var(--color-primary-600)] hover:underline font-semibold"
                  >
                    Set
                  </button>
                </div>
              </td>
              <td className="px-6 py-3 flex gap-2">
                <button
                  onClick={() => { setEditId(p._id); setForm({ title: p.title || '', description: p.description || '', category: p.category, subCategory: p.subCategory || '', brand: p.brand || '', priceCents: (p.priceCents / 100).toString(), discountPercentage: (p.discountPercentage || 0).toString(), stock: p.stock.toString(), images: (p.images || []).join(', '), tags: (p.tags || []).join(', ') }); setOpenForm(true); }}
                  className="text-xs text-[var(--color-primary-600)] hover:underline font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
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
    <div className="table-scroll rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
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
