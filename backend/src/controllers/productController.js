import Product from '../models/Product.js';
import User from '../models/User.js';

/** GET /products — public, query filters, sort, pagination */
export const getProducts = async (request, response, next) => {
  try {
    const {
      category,
      subCategory,
      seller,
      search,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sort,
      page = 1,
      limit = 12,
    } = request.query;

    const filter = {};

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (seller) filter.seller = seller;
    if (minPrice || maxPrice) {
      filter.priceCents = {};
      if (minPrice) filter.priceCents.$gte = Number(minPrice) * 100;
      if (maxPrice) filter.priceCents.$lte = Number(maxPrice) * 100;
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (inStock === 'true') filter.stock = { $gt: 0 };
    if (inStock === 'false') filter.stock = { $eq: 0 };

    if (search) {
      filter.$text = { $search: search };
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { priceCents: 1 };
    else if (sort === 'price_desc') sortOption = { priceCents: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'featured') sortOption = { isFeatured: -1, createdAt: -1 };
    else sortOption = { createdAt: -1 };

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ]);

    return response.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (error) {
    next(error);
  }
};

/** GET /products/categories — public */
export const getCategories = async (request, response, next) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { category: 1 } },
    ]);
    return response.json(categories);
  } catch (error) {
    next(error);
  }
};

/** GET /products/:id — public */
export const getProductById = async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id);
    if (!product) {
      return response.status(404).json({ message: 'Product not found', status: 404 });
    }
    return response.json(product);
  } catch (error) {
    next(error);
  }
};

/** GET /products/:id/related — public */
export const getRelated = async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id);
    if (!product) {
      return response.status(404).json({ message: 'Product not found', status: 404 });
    }
    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(4);
    return response.json(related);
  } catch (error) {
    next(error);
  }
};

/** POST /products — seller */
export const createProduct = async (request, response, next) => {
  try {
    const product = await Product.create({ ...request.body, seller: request.user._id });
    return response.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

/** PUT /products/:id — seller owner */
export const updateProduct = async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id);
    if (!product) {
      return response.status(404).json({ message: 'Product not found', status: 404 });
    }
    if (product.seller.toString() !== request.user._id.toString() && request.user.role !== 'admin') {
      return response.status(403).json({ message: 'Not authorized to update this product', status: 403 });
    }
    const updated = await Product.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
    return response.json(updated);
  } catch (error) {
    next(error);
  }
};

/** DELETE /products/:id — seller owner or admin */
export const deleteProduct = async (request, response, next) => {
  try {
    const product = await Product.findById(request.params.id);
    if (!product) {
      return response.status(404).json({ message: 'Product not found', status: 404 });
    }
    if (product.seller.toString() !== request.user._id.toString() && request.user.role !== 'admin') {
      return response.status(403).json({ message: 'Not authorized to delete this product', status: 403 });
    }
    await product.deleteOne();
    return response.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

/** PATCH /products/:id/stock — seller owner */
export const updateStock = async (request, response, next) => {
  try {
    const { stock } = request.body;
    if (stock === undefined || stock < 0) {
      return response.status(400).json({ message: 'Valid stock required', status: 400 });
    }
    const product = await Product.findById(request.params.id);
    if (!product) {
      return response.status(404).json({ message: 'Product not found', status: 404 });
    }
    if (product.seller.toString() !== request.user._id.toString() && request.user.role !== 'admin') {
      return response.status(403).json({ message: 'Not authorized to update stock', status: 403 });
    }
    product.stock = stock;
    await product.save();
    return response.json(product);
  } catch (error) {
    next(error);
  }
};

/** GET /sellers/:id — public shop info */
export const getSeller = async (request, response, next) => {
  try {
    const seller = await User.findById(request.params.id).select('-password -wishlist');
    if (!seller || !['seller', 'admin'].includes(seller.role)) {
      return response.status(404).json({ message: 'Seller not found', status: 404 });
    }
    return response.json(seller);
  } catch (error) {
    next(error);
  }
};

/** GET /sellers/:id/products — public shop page */
export const getSellerProducts = async (request, response, next) => {
  try {
    const products = await Product.find({ seller: request.params.id }).sort({ createdAt: -1 }).lean();
    return response.json(products);
  } catch (error) {
    next(error);
  }
};
