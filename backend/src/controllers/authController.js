import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

/** POST /auth/register — public */
export const register = async (request, response, next) => {
  try {
    const { name, email, password, role, shopName } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ message: 'Name, email and password are required', status: 400 });
    }
    if (role && !['customer', 'seller'].includes(role)) {
      return response.status(400).json({ message: 'Invalid role', status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return response.status(400).json({ message: 'Email already registered', status: 400 });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 12),
      role: role || 'customer',
      shopName: role === 'seller' ? shopName : undefined,
    });

    const token = signToken(user);
    return response.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, shopName: user.shopName },
    });
  } catch (error) {
    next(error);
  }
};

/** POST /auth/login — public */
export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: 'Email and password are required', status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return response.status(401).json({ message: 'Invalid credentials', status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({ message: 'Invalid credentials', status: 401 });
    }

    const token = signToken(user);
    return response.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, shopName: user.shopName },
    });
  } catch (error) {
    next(error);
  }
};

/** GET /auth/me — logged in */
export const me = async (request, response) => {
  const user = await User.findById(request.user._id).select('-password');
  return response.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, shopName: user.shopName } });
};
