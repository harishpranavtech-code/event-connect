const fastify = require('fastify');
const cors = require('@fastify/cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const buildApp = (opts = {}) => {
  const app = fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
    },
    ...opts,
  });

  // Register CORS
  app.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Health check route
  app.get('/', async (request, reply) => {
    return {
      success: true,
      message: 'CampusConnect Lite API is running',
      timestamp: new Date().toISOString(),
    };
  });

  // API routes
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(eventRoutes, { prefix: '/api/events' });
  app.register(registrationRoutes, { prefix: '/api/register' });
  app.register(adminRoutes, { prefix: '/api/admin' });

  // 404 handler
  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      success: false,
      message: 'Route not found',
      path: request.url,
    });
  });

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    console.error('Server Error:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return reply.code(400).send({
        success: false,
        message: 'Validation Error',
        errors: messages,
      });
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return reply.code(400).send({
        success: false,
        message: `Duplicate value for ${field}`,
      });
    }

    // Mongoose cast error
    if (error.name === 'CastError') {
      return reply.code(400).send({
        success: false,
        message: 'Invalid ID format',
      });
    }

    // Default error
    reply.code(error.statusCode || 500).send({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  });

  return app;
};

module.exports = buildApp;
