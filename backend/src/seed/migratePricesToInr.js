import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in .env');
}

const productPrices = {
  'SUP-WPI-VAN-001': 249900,
  'SUP-WPI-CHO-002': 249900,
  'SUP-CRE-UNF-003': 79900,
  'SUP-PRE-EP-004': 129900,
  'SUP-BCAA-REC-005': 149900,
  'SUP-MULTI-AA-006': 49900,
  'EQ-DB-ADJ-007': 999900,
  'EQ-KB-SET-008': 699900,
  'EQ-RB-LOOP-009': 39900,
  'EQ-PUB-DR-010': 149900,
  'EQ-YM-6MM-011': 79900,
  'EQ-JR-SPD-012': 29900,
  'EQ-BB-RACK-013': 1499900,
  'AP-TEE-BLK-014': 79900,
  'AP-CS-SHORT-015': 89900,
  'AP-HOOD-CH-016': 149900,
  'AP-LEG-HW-017': 129900,
  'AP-TANK-GYM-018': 49900,
  'FW-TRAIN-CROSS-019': 299900,
  'FW-LIFT-HEEL-020': 499900,
  'FW-RUN-CUSH-021': 399900,
  'ACC-SHK-700-022': 19900,
  'ACC-LG-GRIP-023': 39900,
  'ACC-WW-PAIR-024': 29900,
  'ACC-GB-LRG-025': 99900,
  'ACC-LS-STRAP-026': 19900,
  'ACC-WLB-LEATHER-027': 129900,
  'REC-FR-EVA-028': 69900,
  'REC-MG-PERC-029': 249900,
  'REC-ICE-GEL-030': 14900,
  'REC-AS-BRACE-031': 29900,
  'REC-CS-SOCKS-032': 39900,
};

const coupons = [
  { code: 'POWER15', type: 'percent', value: 15, minSubtotalCents: 200000 },
  { code: 'LIFT5', type: 'flat', value: 5000, minSubtotalCents: 50000 },
];

const migrate = async () => {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  try {
    const productResult = await Product.bulkWrite(
      Object.entries(productPrices).map(([sku, priceCents]) => ({
        updateOne: { filter: { sku }, update: { $set: { priceCents } } },
      }))
    );
    const couponResult = await Coupon.bulkWrite(
      coupons.map(({ code, ...values }) => ({
        updateOne: { filter: { code }, update: { $set: values } },
      }))
    );

    console.log(`Updated ${productResult.modifiedCount} catalog prices to INR.`);
    console.log(`Updated ${couponResult.modifiedCount} coupon settings.`);
    console.log('Existing users, orders, and seller products were not changed.');
  } finally {
    await mongoose.disconnect();
  }
};

migrate().catch((error) => {
  console.error('INR price migration failed:', error.message);
  process.exitCode = 1;
});
