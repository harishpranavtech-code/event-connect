const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
} = require('../controllers/registrationController');

async function registrationRoutes(fastify, options) {
  // Register for an event - student only
  fastify.post(
    '/:eventId',
    { preHandler: [authenticate, authorize('student')] },
    registerForEvent
  );

  // Get my registrations - student
  fastify.get(
    '/my-registrations',
    { preHandler: [authenticate, authorize('student')] },
    getMyRegistrations
  );

  // Cancel registration - student only
  fastify.delete(
    '/:eventId',
    { preHandler: [authenticate, authorize('student')] },
    cancelRegistration
  );
}

module.exports = registrationRoutes;
