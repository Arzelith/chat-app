const User = require('../models/user-model');
const Token = require('../models/token-model');
const sendEmail = require('../utils/email-handler');
const crypto = require('crypto');
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
    throw new ApiError(401, 'Contraseña incorrecta');
  }

  if (!user.verified) {
    let emailVerificationToken = await Token.findOne({ userId: user._id });
    if (!emailVerificationToken) {
      emailVerificationToken = await Token.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      });
      const baseUrl =
        process.env.NODE_ENV !== 'production'
          ? `http://localhost:3000`
          : process.env.ORIGIN;
      const url = `${baseUrl}/account/${user._id}/verify/${emailVerificationToken.token}`;
      await sendEmail(user.email, 'Verifica tu cuenta Mern chat', url, user.displayName);
    }
    throw new ApiError(
      403,
      `Un correo electrónico ha sido enviado a ${user.email}, por favor finalize el proceso de verificación`
    );
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user, res);
  user.refreshToken = refreshToken;
  user.isOnline = '1';
  await user.save();

  res.status(200).json({ user, accessToken });
});

module.exports = { login };
