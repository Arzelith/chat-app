const User = require('../models/user-model');
const { asyncHandler } = require('../utils/async-handler');
const ApiError = require('../errors/api-error');
const { generateAccessToken, generateRefreshToken } = require('../utils/token-manager');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, 'Todos los campos sor requeridos');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Email incorrecto');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, 'El password ingresado es incorrecto');
  }
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user, res);
  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({ user, accessToken });
});

module.exports = { login };
