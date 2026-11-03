/** Client-side pricing — must match backend utils/pricing.js exactly. All cents. */

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
  if (subtotalCents >= 5000) return 0;
  if (coupon && coupon.type === 'freeShipping') return 0;
  return 499;
};

export const total = (subtotalCents, discountCents, shippingCents) =>
  subtotalCents - discountCents + shippingCents;

/** Coupon info for the cart UI */
export const couponInfo = (code) => {
  const c = code.toUpperCase();
  if (c === 'SAVE10') return { code: 'SAVE10', type: 'percent', value: 10, minSubtotalCents: 0 };
  if (c === 'POWER15') return { code: 'POWER15', type: 'percent', value: 15, minSubtotalCents: 10000 };
  if (c === 'LIFT5') return { code: 'LIFT5', type: 'flat', value: 500, minSubtotalCents: 2000 };
  return null;
};
