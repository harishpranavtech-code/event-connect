require('dotenv').config();
const buildApp = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Build and start server
const app = buildApp();

const start = async () => {
  try {
    await app.listen({
      port: PORT,
      host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    });

    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🎓 CampusConnect Lite API Server                    ║
║                                                        ║
║   ✅ Server running on port ${PORT}                       ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                  ║
║   📡 API Base: http://localhost:${PORT}/api               ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  app.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, closing server gracefully');
  app.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

start();
