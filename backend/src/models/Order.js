import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  image: { type: String, default: '' },
  unitPriceCents: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    couponCode: { type: String, default: '' },
    subtotalCents: { type: Number, required: true },
    discountCents: { type: Number, default: 0 },
    shippingCents: { type: Number, default: 0 },
    totalCents: { type: Number, required: true },
    shippingAddress: shippingAddressSchema,
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);
