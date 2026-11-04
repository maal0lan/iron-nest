import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { selectCartItems, selectItemCount, selectCartSubtotal, selectCartDiscount, selectCartShipping, selectCartTotal, selectCartCoupon, clearCart } from '../features/cart/cartSlice.js';
import { placeOrder } from '../features/orders/ordersSlice.js';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { PriceTag } from '../components/PriceTag.jsx';
import { formatMoney } from '../utils/money.js';

const validateMobileNumber = (value) => (
  /^\d{10}$/.test(value) ? '' : 'Mobile number must contain exactly 10 digits.'
);

const validatePincode = (value) => (
  /^\d{6}$/.test(value) ? '' : 'Pincode must contain exactly 6 digits.'
);

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

  const [form, setForm] = useState({
    fullName: '', phone: '', line1: '', city: '', pincode: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const mobileError = (form.phone || hasSubmitted) ? validateMobileNumber(form.phone) : '';
  const pincodeError = (form.pincode || hasSubmitted) ? validatePincode(form.pincode) : '';

  if (itemCount === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    setError('');
    if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.pincode) {
      setError('Please fill in all address fields.');
      return;
    }
    if (validateMobileNumber(form.phone) || validatePincode(form.pincode)) return;

    setSubmitting(true);
    try {
      const result = await dispatch(placeOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        couponCode,
        shippingAddress: form,
      }));
      if (placeOrder.fulfilled.match(result)) {
        dispatch(clearCart());
        navigate(`/order/${result.payload._id}`);
      } else {
        setError(result.payload?.message || result.error?.message || 'Checkout failed. Try again.');
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
          <h1 className="page-title mb-6">Checkout</h1>
          <p className="page-subtitle mb-6">Demo checkout — no real payment. Your order will be created and saved.</p>

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
              label="Mobile number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              error={mobileError}
              inputMode="numeric"
              autoComplete="tel"
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
                error={pincodeError}
                inputMode="numeric"
                autoComplete="postal-code"
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-[var(--color-danger-50)] p-3 text-[var(--color-danger-700)] text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="min-h-[var(--control-lg)] w-full rounded-md bg-[var(--color-primary-600)] px-4 text-base font-semibold text-[var(--on-primary)] transition hover:bg-[var(--color-primary-700)] disabled:opacity-50"
            >
              {submitting ? 'Placing order…' : 'Place order'}
            </Button>
            <p className="text-xs text-[var(--color-gray-500)] mt-3 text-center">This is a demo store — no card is charged.</p>
          </form>
        </div>

        {/* Order summary */}
        <div className="shrink-0 lg:w-80">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <h2 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-6">Order summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="font-medium text-[var(--text-strong)]">{item.title}</span>
                    <span className="shrink-0 text-[var(--color-gray-500)]">× {item.quantity}</span>
                  </div>
                  <PriceTag
                    priceCents={item.priceCents}
                    discountPercentage={item.discountPercentage}
                    compact
                    className="mt-1"
                  />
                </div>
              ))}
            </div>

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
