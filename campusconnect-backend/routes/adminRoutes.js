const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { getAdminStats } = require('../controllers/dashboardController');
const {
  getAllRegistrations,
  getEventRegistrations,
} = require('../controllers/registrationController');

async function adminRoutes(fastify, options) {
  // Get admin statistics
  fastify.get(
    '/stats',
    { preHandler: [authenticate, authorize('admin')] },
    getAdminStats
  );

  // Get all registrations
  fastify.get(
    '/registrations',
    { preHandler: [authenticate, authorize('admin')] },
    getAllRegistrations
  );

  // Get registrations for a specific event
  fastify.get(
    '/registrations/:eventId',
    { preHandler: [authenticate, authorize('admin')] },
    getEventRegistrations
  );
}

module.exports = adminRoutes;
