const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (request, reply) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    // Additional statistics
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() },
    });
    const pastEvents = await Event.countDocuments({
      date: { $lt: new Date() },
    });

    reply.send({
      success: true,
      data: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        userBreakdown: {
          students: totalStudents,
          admins: totalAdmins,
        },
        eventBreakdown: {
          upcoming: upcomingEvents,
          past: pastEvents,
        },
      },
    });
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (request, reply) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    reply.send({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
};
