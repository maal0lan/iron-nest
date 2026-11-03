import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder, selectCartItems, selectItemCount, selectCartSubtotal, selectCartDiscount, selectCartShipping, selectCartTotal, selectCartCoupon } from '../features/cart/cartSlice.js';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { PriceTag } from '../components/PriceTag.jsx';
import { formatMoney } from '../utils/money.js';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectItemCount);
  const sub = useSelector(selectCartSubtotal);
  const disc = useSelector(selectCartDiscount);
  const ship = useSelector(selectCartShipping);
  const tot = useSelector(selectCartTotal);
  const couponCode = useSelector(selectCartCoupon);

  if (itemCount === 0) {
    navigate('/cart');
    return null;
  }

  const [form, setForm] = useState({
    fullName: '', phone: '', line1: '', city: '', pincode: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.pincode) {
      setError('Please fill in all address fields.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await dispatch(placeOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        couponCode,
        shippingAddress: form,
      }));
      if (placeOrder.fulfilled.match(result)) {
        navigate(`/order/${result.payload._id}`);
      }
    } catch (err) {
      setError(err.message || 'Checkout failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page py-6">
      <div className="flex flex-col lg:flex-row gap-8 max-w-[900px] mx-auto">
        {/* Address form */}
        <div className="flex-1">
          <h1 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-strong)] mb-6">Checkout</h1>
          <p className="text-[var(--color-gray-500)] text-sm mb-6">Demo checkout — no real payment. Your order will be created and saved.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="fullName"
              label="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
            <Input
              id="phone"
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <Input
              id="line1"
              label="Address line 1"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="city"
                label="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
              />
              <Input
                id="pincode"
                label="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-[var(--color-danger-50)] p-3 text-[var(--color-danger-700)] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-[var(--color-primary-600)] text-white px-4 py-3 text-lg font-semibold hover:bg-[var(--color-primary-700)] disabled:opacity-50 transition"
            >
              {submitting ? 'Placing order…' : 'Place order'}
            </button>
            <p className="text-xs text-[var(--color-gray-500)] mt-3 text-center">This is a demo store — no card is charged.</p>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm sticky top-6">
            <h2 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-6">Order summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-gray-500)]">Subtotal ({itemCount} items)</span>
                <span className="text-[var(--text-strong)]">{formatMoney(sub)}</span>
              </div>
              {disc > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-gray-500)]">Coupon ({couponCode})</span>
                  <span className="text-[var(--color-success-700)] font-semibold">−{formatMoney(disc)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-gray-500)]">Shipping</span>
                <span className={`text-xs font-semibold ${ship === 0 ? 'text-[var(--color-success-700)]' : 'text-[var(--color-gray-700)]'}`}>
                  {ship === 0 ? 'FREE' : formatMoney(ship)}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <div className="flex justify-between text-lg font-bold text-[var(--text-strong)]">
                <span>Total</span>
                <span>{formatMoney(tot)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
