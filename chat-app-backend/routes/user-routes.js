const express = require('express');
const {
  registerUser,
  updatePassword,
  updateProfileInfo,
  updateProfileAvatar,
  findUser,
} = require('../controllers/user-controller');
const auth = require('../middlewares/auth-handler');
const router = express.Router();

router.route('/').post(registerUser).get(auth, findUser);
router.route('/current-user/password').patch(auth, updatePassword);
router.route('/current-user/profile-info').patch(auth, updateProfileInfo);
router.route('/current-user/avatar/:action').patch(auth, updateProfileAvatar);

module.exports = router;
