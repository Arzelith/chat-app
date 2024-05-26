const User = require('../models/user-model');
const Token = require('../models/token-model');
const sendEmail = require('../utils/email-handler');
const crypto = require('crypto');
const { asyncHandler } = require('../utils/async-handler');
const { upload } = require('../utils/upload-handler');
const ApiError = require('../errors/api-error');

const registerUser = asyncHandler(async (req, res) => {
  const { displayName, email, password, confirmPassword } = req.body;
  if (!displayName || !email || !password || !confirmPassword) {
    throw new ApiError(400, 'Todos los campos son requeridos');
  }
  await checkUnique(
    { email: email.toLowerCase() },
    'Ya existe un usuario registrado con este email'
  );
  await checkUnique(
    { displayName: { $regex: displayName, $options: 'i' } },
    'Este nombre de usuario ya se encuentra en uso'
  );
  checkPass(password, confirmPassword);
  const createdUser = await User.create({
    displayName,
    email: email.toLowerCase(),
    password,
  });

  const emailVerificationToken = await Token.create({
    userId: createdUser._id,
    token: crypto.randomBytes(32).toString('hex'),
  });
  const baseUrl =
    process.env.NODE_ENV !== 'production' ? `http://localhost:3000` : process.env.ORIGIN;
  const url = `${baseUrl}/account/${createdUser._id}/verify/${emailVerificationToken.token}`;
  await sendEmail(createdUser.email, 'Verifica tu cuenta Mern chat', url, createdUser.displayName);

  res.status(201).json({
    user: {
      displayName: createdUser.displayName,
      email: createdUser.email,
      avatar: createdUser.avatar,
    },
    message: `Un correo electrónico ha sido enviado a ${createdUser.email}, por favor verifique su cuenta`,
  });
});

const verifyUser = asyncHandler(async (req, res) => {
  const { userId, token } = req.params;
  if (!userId || !token) {
    throw new ApiError(400, 'Este vínculo no es válido');
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ApiError(400, 'Este vínculo no es válido');
  }
  const verificationToken = await Token.findOne({
    userId: userId,
    token: token,
  });
  if (!verificationToken) {
    throw new ApiError(400, 'Este vínculo no es válido');
  }
  user.verified = true;
  const updatedUser = await user.save();
  await verificationToken.deleteOne({ _id: verificationToken._id });
  res.status(200).json(updatedUser);
});

const findUser = asyncHandler(async (req, res) => {
  const search = req.query.search;
  if (!search) {
    return res.status(200).json([]);
  }

  const users = await User.find({
    $and: [
      {
        displayName: { $regex: search, $options: 'i' },
      },
      { _id: { $ne: req.user._id } },
    ],
  });

  res.status(200).json(users);
});

const updateEmail = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const { email } = req.body;
  if (!id) {
    throw new ApiError(400, 'Id de usuario no encontrada');
  }
  if (!email) {
    throw new ApiError(400, 'Todos los campos son requeridos');
  }
  const user = await User.findById(id);
  if (user.email !== email.toLowerCase()) {
    await checkUnique(
      { email: email.toLowerCase() },
      'Ya existe un usuario registrado con este email'
    );
  }

  user.email = email.toLowerCase();
  await user.save();
  res.status(200).json({ user });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const id = req.user._id;
  if (!id) {
    throw new ApiError(400, 'Id de usuario no encontrada');
  }
  if (!status) {
    throw new ApiError(400, 'Estado de usuario no encontrado');
  }
  const user = await User.findById(id);
  user.status = status;
  await user.save();
  res.status(200).json({ user });
});

const updateProfileAvatar = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const { action } = req.params;
  const { avatar64 } = req.body;
  if (!id) {
    throw new ApiError(400, 'Id de usuario no encontrada');
  }
  const user = await User.findById(id);
  if (action === 'replace') {
    if (!avatar64) {
      throw new ApiError(400, 'Archivo de imagen no encontrado');
    }
    const result = await upload(avatar64, id);
    user.avatar = result.secure_url;
  }
  if (action === 'remove') {
    user.avatar = '';
  }
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

//HELPERS
const checkPass = (password, confirmPassword) => {
  if (password.length < 6 || password.length > 20) {
    throw new ApiError(400, 'La contraseña debe tener entre 6 y 20 caracteres');
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, 'Las contraseñas no concuerdan');
  }
};

const checkUnique = async (condition, message) => {
  const user = await User.findOne(condition);
  if (user) {
    throw new ApiError(409, message);
  }
};

module.exports = {
  registerUser,
  updatePassword,
  updateEmail,
  updateProfileAvatar,
  findUser,
  updateUserStatus,
  verifyUser,
};
