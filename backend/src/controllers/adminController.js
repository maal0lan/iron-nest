import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

/** GET /admin/stats — admin */
export const getAdminStats = async (request, response, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalCents' } } }]);
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { title: '$product.title', count: 1, _id: 0 } },
    ]);
    const topCategories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);
    return response.json({
      totalUsers,
      totalOrders,
      totalRevenueCents: totalRevenue[0]?.total || 0,
      topProducts,
      topCategories,
    });
  } catch (error) {
    next(error);
  }
};

/** GET /admin/sellers — admin */
export const getAdminSellers = async (request, response, next) => {
  try {
    const sellers = await User.find({ role: 'seller' }).select('-password');
    const result = await Promise.all(sellers.map(async (seller) => {
      const productCount = await Product.countDocuments({ seller: seller._id });
      const orders = await Order.find({ 'items.seller': seller._id });
      let totalSales = 0;
      for (const order of orders) {
        totalSales += order.items
          .filter((item) => item.seller.toString() === seller._id.toString())
          .reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
      }
      return { id: seller._id, name: seller.name, shopName: seller.shopName, email: seller.email, productCount, totalSalesCents: totalSales };
    }));
    return response.json(result);
  } catch (error) {
    next(error);
  }
};
