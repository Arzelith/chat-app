const express = require('express');
const {
  registerUser,
  updatePassword,
  updateEmail,
  updateProfileAvatar,
  findUser,
  updateUserStatus,
} = require('../controllers/user-controller');
const auth = require('../middlewares/auth-handler');
const router = express.Router();

router.route('/').post(registerUser).get(auth, findUser);
router.route('/current-user/').patch(auth, updateUserStatus);
router.route('/current-user/password').patch(auth, updatePassword);
router.route('/current-user/email').patch(auth, updateEmail);
router.route('/current-user/avatar/:action').patch(auth, updateProfileAvatar);

module.exports = router;
