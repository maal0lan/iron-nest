import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    sku: { type: String, trim: true },
    category: {
      type: String,
      enum: ['supplements', 'equipment', 'apparel', 'footwear', 'accessories', 'recovery'],
      required: true,
    },
    subCategory: { type: String, trim: true },
    brand: { type: String, trim: true },
    priceCents: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    thumbnail: { type: String, default: '' },
    images: [{ type: String }],
    tags: [{ type: String }],
    returnPolicy: { type: String, default: '' },
    warrantyInformation: { type: String, default: '' },
    shippingInformation: { type: String, default: '' },
    specifications: [specificationSchema],
    reviews: [reviewSchema],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for filtering/sorting/search
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ priceCents: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text', brand: 'text' });

// Virtual response field: discounted price in cents
productSchema.virtual('discountedPriceCents').get(function () {
  const discount = this.discountPercentage || 0;
  return Math.round(this.priceCents * (1 - discount / 100));
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
