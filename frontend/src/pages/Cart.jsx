import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  setCoupon, clearCouponError, validateCoupon, clearCart,
  selectCartItems, selectItemCount, selectCartSubtotal, selectCartDiscount,
  selectCartShipping, selectCartTotal, selectCartCoupon, selectCartCouponStatus, selectCartCouponError,
} from '../features/cart/cartSlice.js';
import { PriceTag } from '../components/PriceTag.jsx';
import { QtyStepper } from '../components/QtyStepper.jsx';
import { StockBadge } from '../components/StockBadge.jsx';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { formatMoney } from '../utils/money.js';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectItemCount);
  const sub = useSelector(selectCartSubtotal);
  const disc = useSelector(selectCartDiscount);
  const ship = useSelector(selectCartShipping);
  const tot = useSelector(selectCartTotal);
  const couponCode = useSelector(selectCartCoupon);
  const couponStatus = useSelector(selectCartCouponStatus);
  const couponError = useSelector(selectCartCouponError);

  if (itemCount === 0) {
    return (
      <div className="container page py-20">
        <div className="text-center">
          <div className="rounded-full bg-[var(--color-gray-100)] p-6 text-[var(--color-gray-500)] inline-block mb-4">🛒</div>
          <h3 className="text-lg font-semibold text-[var(--text-strong)] mb-2">Your cart is empty</h3>
          <p className="text-[var(--color-gray-500)] mb-6">Add some gear to get started.</p>
          <Link to="/products" className="rounded-md bg-[var(--color-primary-600)] text-white px-6 py-2 text-sm font-semibold hover:bg-[var(--color-primary-700)] transition inline-block">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleApply = (e) => {
    e.preventDefault();
    dispatch(validateCoupon({ code: couponCode || '', subtotalCents: sub }));
  };

  return (
    <div className="container page py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-strong)]">Shopping cart ({itemCount} items)</h1>
              <Link to="/products" className="text-sm text-[var(--color-primary-600)] hover:underline">← Continue shopping</Link>
            </div>
            <button
              onClick={() => dispatch(clearCart())}
              className="text-xs text-[var(--color-danger-700)] hover:underline font-semibold"
            >
              Clear cart
            </button>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-sm overflow-hidden">
            {items.map((item) => {
              const lineTotal = item.priceCents * item.quantity * (1 - (item.discountPercentage || 0) / 100);
              return (
                <div key={item.productId} className="flex items-center gap-4 p-6 border-b border-[var(--border)] last:border-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-24 rounded-lg object-cover bg-[var(--color-gray-100)]"
                  />
                  <div className="flex-1">
                    <Link to={`/product/${item.productId}`} className="text-sm font-semibold text-[var(--text-strong)] hover:text-[var(--color-primary-600)] block mb-1">
                      {item.title}
                    </Link>
                    <p className="text-xs text-[var(--color-gray-500)] mb-1">{item.category}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[var(--text-strong)]">{formatMoney(Math.round(item.priceCents * (1 - (item.discountPercentage || 0) / 100)))}</span>
                      {item.discountPercentage && (
                        <span className="text-xs text-[var(--color-gray-500)] line-through">{formatMoney(item.priceCents)}</span>
                      )}
                    </div>
                  </div>
                  <QtyStepper productId={item.productId} stock={item.stock} />
                  <span className="font-semibold text-[var(--text-strong)]">{formatMoney(Math.round(lineTotal))}</span>
                  <button
                    onClick={() => dispatch({ type: 'cart/removeItem', payload: item.productId })}
                    className="text-xs text-[var(--color-danger-700)] hover:text-[var(--color-danger-700)] underline"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm sticky top-6">
            <h2 className="font-heading text-lg font-bold text-[var(--text-strong)] mb-6">Order summary</h2>

            <div className="mb-6">
              <form onSubmit={handleApply} className="flex gap-2">
                <Input
                  id="coupon"
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => dispatch(setCoupon(e.target.value))}
                  className="flex-1 min-w-0"
                />
                <Button variant="primary" size="sm" type="submit" disabled={couponStatus === 'loading'}>
                  {couponStatus === 'loading' ? '…' : 'Apply'}
                </Button>
              </form>
              {couponError && (
                <p className="mt-2 text-xs text-[var(--color-danger-700)]">{couponError}</p>
              )}
              {couponCode && couponStatus === 'succeeded' && !couponError && (
                <p className="mt-2 text-xs text-[var(--color-success-700)] font-semibold">
                  {couponCode} applied: {formatMoney(disc)} off
                </p>
              )}
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
              <div className="flex justify-between text-lg font-bold text-[var(--text-strong)] mb-2">
                <span>Total</span>
                <span>{formatMoney(tot)}</span>
              </div>
              {sub < 5000 && disc === 0 && (
                <p className="text-xs text-[var(--color-primary-600)] mb-4 text-center">
                  Add {formatMoney(5000 - sub)} more for free shipping
                </p>
              )}
              <Link to="/checkout" className="w-full rounded-md bg-[var(--color-primary-600)] text-white px-4 py-3 text-lg font-semibold hover:bg-[var(--color-primary-700)] transition block text-center">
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
