/**
 * Server-side pricing — the source of truth for all money math.
 * All values in integer cents. Round half up per calculation.
 */

/** Discounted unit price for a single product. */
export const unitPrice = (product) => {
  const discount = product.discountPercentage || 0;
  return Math.round(product.priceCents * (1 - discount / 100));
};

/** Subtotal of cart/order items (uses each item's discounted unit price). */
export const subtotal = (items) =>
  items.reduce((sum, item) => sum + unitPrice(item) * item.quantity, 0);

/** Coupon discount applied to the pre-coupon subtotal. */
export const couponDiscount = (subtotalCents, coupon) => {
  if (!coupon || !coupon.active) return 0;
  if (subtotalCents < (coupon.minSubtotalCents || 0)) return 0;
  if (coupon.type === 'percent') return Math.round((subtotalCents * coupon.value) / 100);
  if (coupon.type === 'flat') return Math.min(coupon.value, subtotalCents);
  // freeShipping coupons give no line-item discount
  return 0;
};

/** Shipping cost: free at subtotal >= $50 or with a freeShipping coupon, else $4.99. */
export const shipping = (subtotalCents, coupon) => {
  if (subtotalCents >= 5000) return 0;
  if (coupon && coupon.type === 'freeShipping') return 0;
  return 499;
};

/** Final total. */
export const total = (subtotalCents, discountCents, shippingCents) =>
  subtotalCents - discountCents + shippingCents;
