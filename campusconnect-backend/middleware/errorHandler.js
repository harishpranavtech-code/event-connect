const errorHandler = (error, request, reply) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    message = Object.values(error.errors)
      .map((val) => val.message)
      .join(', ');
    statusCode = 400;
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  reply.status(statusCode).send({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

module.exports = errorHandler;
