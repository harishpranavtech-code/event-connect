const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register for an event
// @route   POST /api/register/:eventId
// @access  Private (Student only)
const registerForEvent = async (request, reply) => {
  try {
    const { eventId } = request.params;
    const userId = request.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return reply.code(404).send({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId,
    });

    if (existingRegistration) {
      return reply.code(400).send({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Create registration
    const registration = await Registration.create({
      user: userId,
      event: eventId,
    });

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'name email')
      .populate('event', 'title description date');

    reply.code(201).send({
      success: true,
      message: 'Successfully registered for the event',
      data: populatedRegistration,
    });
  } catch (error) {
    console.error('Register Event Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while registering for event',
      error: error.message,
    });
  }
};

// @desc    Get user's registrations
// @route   GET /api/register/my-registrations
// @access  Private (Student)
const getMyRegistrations = async (request, reply) => {
  try {
    const registrations = await Registration.find({ user: request.user._id })
      .populate('event', 'title description date')
      .sort({ createdAt: -1 });

    reply.send({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error('Get My Registrations Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while fetching registrations',
      error: error.message,
    });
  }
};

// @desc    Get all registrations (Admin)
// @route   GET /api/admin/registrations
// @access  Private (Admin only)
const getAllRegistrations = async (request, reply) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email role')
      .populate('event', 'title description date')
      .sort({ createdAt: -1 });

    reply.send({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error('Get All Registrations Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while fetching registrations',
      error: error.message,
    });
  }
};

// @desc    Get registrations for a specific event
// @route   GET /api/admin/registrations/:eventId
// @access  Private (Admin only)
const getEventRegistrations = async (request, reply) => {
  try {
    const { eventId } = request.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return reply.code(404).send({
        success: false,
        message: 'Event not found',
      });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email role')
      .populate('event', 'title description date');

    reply.send({
      success: true,
      count: registrations.length,
      event: event.title,
      data: registrations,
    });
  } catch (error) {
    console.error('Get Event Registrations Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while fetching event registrations',
      error: error.message,
    });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/register/:eventId
// @access  Private (Student)
const cancelRegistration = async (request, reply) => {
  try {
    const { eventId } = request.params;
    const userId = request.user._id;

    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
    });

    if (!registration) {
      return reply.code(404).send({
        success: false,
        message: 'Registration not found',
      });
    }

    await Registration.findByIdAndDelete(registration._id);

    reply.send({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel Registration Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while cancelling registration',
      error: error.message,
    });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getAllRegistrations,
  getEventRegistrations,
  cancelRegistration,
};
