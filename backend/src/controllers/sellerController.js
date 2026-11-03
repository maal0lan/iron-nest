import Product from '../models/Product.js';
import Order from '../models/Order.js';

/** GET /seller/products — seller own products */
export const getSellerProducts = async (request, response, next) => {
  try {
    const products = await Product.find({ seller: request.user._id }).sort({ createdAt: -1 });
    return response.json(products);
  } catch (error) {
    next(error);
  }
};

/** GET /seller/orders — seller orders containing their items */
export const getSellerOrders = async (request, response, next) => {
  try {
    const orders = await Order.find({ 'items.seller': request.user._id }).sort({ createdAt: -1 });
    // Only show the seller's own items in each order
    const sanitized = orders.map((order) => {
      const obj = order.toObject();
      obj.items = obj.items.filter((item) => item.seller.toString() === request.user._id.toString());
      return obj;
    });
    return response.json(sanitized);
  } catch (error) {
    next(error);
  }
};

/** PATCH /seller/orders/:id/status — seller */
export const updateOrderStatus = async (request, response, next) => {
  try {
    const { status } = request.body;
    if (!['pending', 'shipped', 'delivered'].includes(status)) {
      return response.status(400).json({ message: 'Invalid status', status: 400 });
    }
    const order = await Order.findById(request.params.id);
    if (!order) {
      return response.status(404).json({ message: 'Order not found', status: 404 });
    }
    const hasItem = order.items.some((item) => item.seller.toString() === request.user._id.toString());
    if (!hasItem && request.user.role !== 'admin') {
      return response.status(403).json({ message: 'Not authorized', status: 403 });
    }
    order.status = status;
    await order.save();
    return response.json(order);
  } catch (error) {
    next(error);
  }
};

/** GET /seller/stats — seller */
export const getSellerStats = async (request, response, next) => {
  try {
    const products = await Product.find({ seller: request.user._id });
    const orders = await Order.find({ 'items.seller': request.user._id });
    let revenue = 0;
    for (const order of orders) {
      revenue += order.items
        .filter((item) => item.seller.toString() === request.user._id.toString())
        .reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
    }
    const topProduct = products.reduce((best, p) => (p.rating > (best.rating || -1) ? p : best), products[0]);
    return response.json({
      productCount: products.length,
      orderCount: orders.length,
      revenueCents: revenue,
      topProduct,
    });
  } catch (error) {
    next(error);
  }
};
