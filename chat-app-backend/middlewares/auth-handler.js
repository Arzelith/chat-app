const jwt = require('jsonwebtoken');
const ApiError = require('../errors/api-error');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new ApiError(401, 'Autorización inválida');
  }
  const accessToken = authHeader.split(' ')[1];
  try {
    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(403, 'Token expirado');
    }
    throw new ApiError(401, 'Autorización inválida');
  }
};

module.exports = auth;
