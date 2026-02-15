const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

async function eventRoutes(fastify, options) {
  // Get all events - accessible to all authenticated users
  fastify.get('/', { preHandler: authenticate }, getEvents);

  // Get single event - accessible to all authenticated users
  fastify.get('/:id', { preHandler: authenticate }, getEvent);

  // Create event - admin only
  fastify.post(
    '/',
    { preHandler: [authenticate, authorize('admin')] },
    createEvent
  );

  // Update event - admin only
  fastify.put(
    '/:id',
    { preHandler: [authenticate, authorize('admin')] },
    updateEvent
  );

  // Delete event - admin only
  fastify.delete(
    '/:id',
    { preHandler: [authenticate, authorize('admin')] },
    deleteEvent
  );
}

module.exports = eventRoutes;
