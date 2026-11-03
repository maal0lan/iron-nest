import User from '../models/User.js';
import Product from '../models/Product.js';

/** GET /wishlist — customer */
export const getWishlist = async (request, response, next) => {
  try {
    const user = await User.findById(request.user._id).populate('wishlist');
    return response.json(user.wishlist || []);
  } catch (error) {
    next(error);
  }
};

/** POST /wishlist/:productId — customer */
export const addToWishlist = async (request, response, next) => {
  try {
    const { productId } = request.params;
    const product = await Product.findById(productId);
    if (!product) {
      return response.status(404).json({ message: 'Product not found', status: 404 });
    }
    const user = await User.findById(request.user._id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    return response.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

/** DELETE /wishlist/:productId — customer */
export const removeFromWishlist = async (request, response, next) => {
  try {
    const { productId } = request.params;
    const user = await User.findById(request.user._id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    return response.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};
