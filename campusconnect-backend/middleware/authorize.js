const authorize = (...roles) => {
  return async (request, reply) => {
    if (!request.user) {
      return reply.code(401).send({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(request.user.role)) {
      return reply.code(403).send({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }
  };
};

module.exports = authorize;
