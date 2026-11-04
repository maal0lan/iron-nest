/** Client-side pricing — must match backend utils/pricing.js exactly. All values in paise. */

export const unitPrice = (product) => {
  const discount = product.discountPercentage || 0;
  return Math.round(product.priceCents * (1 - discount / 100));
};

export const subtotal = (items) =>
  items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);

export const couponDiscount = (subtotalCents, coupon) => {
  if (!coupon || !coupon.active) return 0;
  if (subtotalCents < (coupon.minSubtotalCents || 0)) return 0;
  if (coupon.type === 'percent') return Math.round((subtotalCents * coupon.value) / 100);
  if (coupon.type === 'flat') return Math.min(coupon.value, subtotalCents);
  return 0;
};

export const shipping = (subtotalCents, coupon) => {
  if (subtotalCents >= 99900) return 0;
  if (coupon && coupon.type === 'freeShipping') return 0;
  return 4900;
};

export const total = (subtotalCents, discountCents, shippingCents) =>
  subtotalCents - discountCents + shippingCents;

/** Coupon info for the cart UI */
export const couponInfo = (code) => {
  const c = code.toUpperCase();
  if (c === 'BHUVAN') return { code: 'BHUVAN', type: 'percent', value: 100, minSubtotalCents: 0 };
  if (c === 'GAINZ20') return { code: 'GAINZ20', type: 'percent', value: 20, minSubtotalCents: 0 };
  if (c === 'LEGDAY') return { code: 'LEGDAY', type: 'flat', value: 10000, minSubtotalCents: 50000 };
  if (c === 'IRON25') return { code: 'IRON25', type: 'percent', value: 25, minSubtotalCents: 200000 };
  if (c === 'FREESHIP') return { code: 'FREESHIP', type: 'freeShipping', value: 0, minSubtotalCents: 0 };
  return null;
};
