const ApiError = require('../errors/api-error');

const apiErrorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  let message;
  if (statusCode === 500) {
    message = 'Ha ocurrido un error inesperado intente más tarde...';
  } else {
    message = error.message;
  }
  const defaultError = {
    statusCode,
    message,
  };

  if (error.name === 'ValidationError') {
    defaultError.statusCode = 400;
    defaultError.message = Object.values(error.errors)
      .map((item) => item.message)
      .join(', ');
  }

  if (error.code && error.code === 11000) {
    defaultError.statusCode = 400;
    defaultError.message = `${Object.keys(error.keyValue)} debe ser único`;
  }

  if (error instanceof ApiError) {
    defaultError.statusCode = error.statusCode;
    defaultError.message = error.message;
  }
  
  res.status(defaultError.statusCode).json({ message: defaultError.message });
};

module.exports = apiErrorHandler;
