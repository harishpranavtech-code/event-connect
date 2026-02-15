const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (request, reply) => {
  try {
    let token;

    // Check for token in headers
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return reply.status(401).send({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      request.user = await User.findById(decoded.id).select('-password');

      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: 'User not found',
        });
      }
    } catch (error) {
      return reply.status(401).send({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: 'Server error in authentication',
    });
  }
};

const authorize = (...roles) => {
  return async (request, reply) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        message: 'Not authorized',
      });
    }

    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({
        success: false,
        message: `User role '${request.user.role}' is not authorized to access this route`,
      });
    }
  };
};

module.exports = { protect, authorize };
