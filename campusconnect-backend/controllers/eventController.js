const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (request, reply) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    reply.send({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Get Events Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while fetching events',
      error: error.message,
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
const getEvent = async (request, reply) => {
  try {
    const event = await Event.findById(request.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!event) {
      return reply.code(404).send({
        success: false,
        message: 'Event not found',
      });
    }

    reply.send({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Get Event Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while fetching event',
      error: error.message,
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin only)
const createEvent = async (request, reply) => {
  try {
    const { title, description, date } = request.body;

    // Validation
    if (!title || !date) {
      return reply.code(400).send({
        success: false,
        message: 'Please provide title and date',
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      date,
      createdBy: request.user._id,
    });

    const populatedEvent = await Event.findById(event._id).populate(
      'createdBy',
      'name email'
    );

    reply.code(201).send({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent,
    });
  } catch (error) {
    console.error('Create Event Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while creating event',
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin only)
const updateEvent = async (request, reply) => {
  try {
    const { title, description, date } = request.body;

    let event = await Event.findById(request.params.id);

    if (!event) {
      return reply.code(404).send({
        success: false,
        message: 'Event not found',
      });
    }

    // Update event
    event = await Event.findByIdAndUpdate(
      request.params.id,
      {
        title: title || event.title,
        description: description !== undefined ? description : event.description,
        date: date || event.date,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('createdBy', 'name email');

    reply.send({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    console.error('Update Event Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while updating event',
      error: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
const deleteEvent = async (request, reply) => {
  try {
    const event = await Event.findById(request.params.id);

    if (!event) {
      return reply.code(404).send({
        success: false,
        message: 'Event not found',
      });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ event: request.params.id });

    // Delete event
    await Event.findByIdAndDelete(request.params.id);

    reply.send({
      success: true,
      message: 'Event and associated registrations deleted successfully',
    });
  } catch (error) {
    console.error('Delete Event Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while deleting event',
      error: error.message,
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
