import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/** Protect route: require a valid JWT. Sets req.user. */
export const protect = async (request, response, next) => {
  let token;
  const authHeader = request.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return response.status(401).json({ message: 'Not authorized, no token', status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return response.status(401).json({ message: 'Not authorized, user not found', status: 401 });
    }
    request.user = user;
    next();
  } catch (error) {
    return response.status(401).json({ message: 'Not authorized, token failed', status: 401 });
  }
};

/** Require a specific role (or admin). */
export const requireRole = (...roles) => (request, response, next) => {
  if (!request.user || !roles.includes(request.user.role)) {
    return response.status(403).json({ message: 'Not authorized for this role', status: 403 });
  }
  next();
};

/** Require seller or admin (owns a shop or is admin). */
export const requireSellerOrAdmin = (request, response, next) => {
  if (!request.user || !['seller', 'admin'].includes(request.user.role)) {
    return response.status(403).json({ message: 'Seller or admin access required', status: 403 });
  }
  next();
};
