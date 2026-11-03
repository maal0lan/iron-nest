import { couponDiscount } from '../utils/pricing.js';
import Coupon from '../models/Coupon.js';

/** POST /coupons/validate — public/customer */
export const validateCoupon = async (request, response, next) => {
  try {
    const { code, subtotalCents } = request.body;

    if (!code) {
      return response.status(400).json({ message: 'Coupon code is required', status: 400, valid: false });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) {
      return response.json({ valid: false, code: code.toUpperCase(), discountCents: 0, message: 'Invalid coupon code' });
    }

    const sub = Number(subtotalCents) || 0;
    if (sub < (coupon.minSubtotalCents || 0)) {
      return response.json({
        valid: false,
        code: coupon.code,
        discountCents: 0,
        message: `Minimum subtotal of $${(coupon.minSubtotalCents / 100).toFixed(2)} required`,
      });
    }

    const discount = couponDiscount(sub, coupon);
    return response.json({ valid: true, code: coupon.code, discountCents: discount, message: 'Coupon applied' });
  } catch (error) {
    next(error);
  }
};
