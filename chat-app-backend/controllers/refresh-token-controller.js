const User = require('../models/user-model');
const { asyncHandler } = require('../utils/async-handler');
const jwt = require('jsonwebtoken');
const ApiError = require('../errors/api-error');
const { generateAccessToken } = require('../utils/token-manager');

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.refreshToken) {
    throw new ApiError(401, 'Cookie no contiene refresh token');
  }
  const refreshToken = cookies.refreshToken;
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    throw new ApiError(401, 'Refresh token no concuerda');
  }
  try {
    const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    const user = await User.findById(_id);
    const accessToken = await generateAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (error) {
    throw new ApiError(403, 'Autorización inválida');
  }
});

module.exports = { handleRefreshToken };
