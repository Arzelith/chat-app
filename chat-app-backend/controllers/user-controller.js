const User = require('../models/user-model');
const { asyncHandler } = require('../utils/async-handler');
const ApiError = require('../errors/api-error');

const registerUser = asyncHandler(async (req, res) => {
  const { displayName, email, password, confirmPassword } = req.body;

  if (!displayName || !email || !password || !confirmPassword) {
    throw new ApiError(400, 'Todos los campos son requeridos');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(409, 'Ya existe un usuario registrado con este email');
  }
  checkPass(password, confirmPassword);
  const createdUser = await User.create({
    displayName,
    email: email.toLowerCase(),
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

const updateProfileInfo = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const { displayName, email } = req.body;
  if (!id) {
    throw new ApiError(400, 'Id de usuario no encontrada');
  }
  if (!displayName || !email) {
    throw new ApiError(400, 'Todos los campos son requeridos');
  }
  const user = await User.findById(id);
  if (user.email !== email.toLowerCase()) {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      throw new ApiError(409, 'El email ingresado ya se encuentra en uso');
    }
  }
  user.displayName = displayName;
  user.email = email.toLowerCase();
  await user.save();
  res.status(200).json({ user });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    throw new ApiError(400, 'Todos los campos son requeridos');
  }
  checkPass(password, confirmPassword);
  const user = await User.findOne({ _id: req.user._id });
  user.password = password;
  await user.save();
  res.sendStatus(200);
});

const checkPass = (password, confirmPassword) => {
  if (password.length < 6 || password.length > 20) {
    throw new ApiError(400, 'El password debe tener entre 6 y 20 caracteres');
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, 'Los passwords no concuerdan');
  }
};

module.exports = { registerUser, updatePassword, updateProfileInfo };
