import { subtotal, couponDiscount, shipping, total } from '../utils/pricing.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

/** POST /orders — customer. Server recalculates prices, checks stock, decrements stock. */
export const createOrder = async (request, response, next) => {
  const session = await Product.startSession();
  session.startTransaction();
  try {
    const { items: itemInputs, couponCode, shippingAddress } = request.body;

    if (!itemInputs || !Array.isArray(itemInputs) || itemInputs.length === 0) {
      await session.abortTransaction();
      return response.status(400).json({ message: 'Order must contain at least one item', status: 400 });
    }

    // Resolve products and validate stock
    const productIds = itemInputs.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(session);
    const productById = new Map(products.map((p) => [p._id.toString(), p]));

    const orderItems = [];
    for (const input of itemInputs) {
      const product = productById.get(input.productId);
      if (!product) {
        await session.abortTransaction();
        return response.status(404).json({ message: `Product ${input.productId} not found`, status: 404 });
      }
      const quantity = Math.max(Number(input.quantity) || 1, 1);
      if (quantity > product.stock) {
        await session.abortTransaction();
        return response.status(400).json({ message: `Not enough stock for ${product.title}`, status: 400 });
      }
      orderItems.push({
        product: product._id,
        seller: product.seller,
        title: product.title,
        image: (product.images && product.images[0]) || product.thumbnail || '',
        unitPriceCents: Math.round(product.priceCents * (1 - (product.discountPercentage || 0) / 100)),
        quantity,
      });
      // Decrement stock
      product.stock -= quantity;
      await product.save({ session });
    }

    const sub = subtotal(orderItems);
    const coupon = couponCode ? await Coupon.findOne({ code: couponCode.toUpperCase(), active: true }).session(session) : null;
    const discount = couponDiscount(sub, coupon);
    const ship = shipping(sub, coupon);
    const tot = total(sub, discount, ship);

    const order = await Order.create([{
      user: request.user._id,
      items: orderItems,
      couponCode: coupon ? coupon.code : '',
      subtotalCents: sub,
      discountCents: discount,
      shippingCents: ship,
      totalCents: tot,
      shippingAddress,
      status: 'pending',
    }], { session });

    await session.commitTransaction();
    return response.status(201).json(order[0]);
  } catch (error) {
    await session.abortTransaction().catch(() => {});
    next(error);
  } finally {
    session.endSession();
  }
};

/** GET /orders/my — customer own orders */
export const getMyOrders = async (request, response, next) => {
  try {
    const orders = await Order.find({ user: request.user._id }).sort({ createdAt: -1 });
    return response.json(orders);
  } catch (error) {
    next(error);
  }
};

/** GET /orders/:id — owner or admin */
export const getOrderById = async (request, response, next) => {
  try {
    const order = await Order.findById(request.params.id);
    if (!order) {
      return response.status(404).json({ message: 'Order not found', status: 404 });
    }
    if (order.user.toString() !== request.user._id.toString() && request.user.role !== 'admin') {
      return response.status(403).json({ message: 'Not authorized', status: 403 });
    }
    return response.json(order);
  } catch (error) {
    next(error);
  }
};
