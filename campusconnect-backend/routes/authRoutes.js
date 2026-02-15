const authenticate = require('../middleware/authenticate');
const { register, login, getMe } = require('../controllers/authController');

async function authRoutes(fastify, options) {
  // Register
  fastify.post('/register', register);

  // Login
  fastify.post('/login', login);

  // Get current user
  fastify.get('/me', { preHandler: authenticate }, getMe);
}

module.exports = authRoutes;
