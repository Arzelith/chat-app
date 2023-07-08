const User = require('../models/user-model');
const { asyncHandler } = require('../utils/async-handler');

const handleLogout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie('refreshToken');
    return res.sendStatus(204);
  }

  res.clearCookie('refreshToken');
  user.refreshToken = '';
  await user.save();
  return res.sendStatus(204);
});

module.exports = { handleLogout };
