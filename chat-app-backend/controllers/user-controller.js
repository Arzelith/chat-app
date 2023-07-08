const User = require('../models/user-model');
const { asyncHandler } = require('../utils/async-handler');
const ApiError = require('../errors/api-error');

const registerUser = asyncHandler(async (req, res) => {
  const { displayName, email, password, confirmPassword } = req.body;
  if (!displayName || !email || !password || !confirmPassword) {
    throw new ApiError(400, 'Todos los campos son requeridos');
  }

  const userExists = await User.findOne({ email });
  // if (userExists) {
  //   throw new ApiError(409, 'Ya existe un usuario registrado con este email');
  // }

  if (password.length < 6 || password.length > 20) {
    throw new ApiError(400, 'El password debe tener entre 6 y 20 caracteres');
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, 'Los passwords no concuerdan');
  }

  const createdUser = await User.create({
    displayName,
    email,
    password,
  });

  res.status(201).json({
    user: {
      displayName: createdUser.displayName,
      email: createdUser.email,
      avatar: createdUser.avatar,
    },
  });
});

module.exports = { registerUser };
