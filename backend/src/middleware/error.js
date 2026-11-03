/** 404 handler for routes that don't exist. */
export const notFound = (_request, response, _next) => {
  response.status(404).json({ message: 'Route not found', status: 404 });
};

/** Global error handler — always returns { message, status }. */
export const errorHandler = (error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    message: error.message || 'Internal Server Error',
    status: statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
