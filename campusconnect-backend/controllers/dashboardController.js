const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (request, reply) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    // Get user role breakdown
    const studentCount = await User.countDocuments({ role: 'student' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Get upcoming events count
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() },
    });

    // Get past events count
    const pastEvents = await Event.countDocuments({
      date: { $lt: new Date() },
    });

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRegistrations = await Registration.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get most popular events
    const popularEvents = await Registration.aggregate([
      {
        $group: {
          _id: '$event',
          registrationCount: { $sum: 1 },
        },
      },
      {
        $sort: { registrationCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'eventDetails',
        },
      },
      {
        $unwind: '$eventDetails',
      },
      {
        $project: {
          _id: 1,
          registrationCount: 1,
          title: '$eventDetails.title',
          date: '$eventDetails.date',
        },
      },
    ]);

    reply.send({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalEvents,
          totalRegistrations,
        },
        users: {
          total: totalUsers,
          students: studentCount,
          admins: adminCount,
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
          past: pastEvents,
        },
        registrations: {
          total: totalRegistrations,
          lastSevenDays: recentRegistrations,
        },
        popularEvents,
      },
    });
  } catch (error) {
    console.error('Get Admin Stats Error:', error);
    return reply.code(500).send({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
};
