const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (request, reply) => {
  try {
    // Get token from header
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return reply.code(401).send({
        success: false,
        message: 'Invalid token. User not found.',
      });
    }

    // Attach user to request
    request.user = user;
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return reply.code(401).send({
        success: false,
        message: 'Invalid token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return reply.code(401).send({
        success: false,
        message: 'Token expired.',
      });
    }

    return reply.code(500).send({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

module.exports = authenticate;
