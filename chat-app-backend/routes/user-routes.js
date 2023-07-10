const express = require('express');
const { registerUser, updatePassword, updateProfileInfo } = require('../controllers/user-controller');
const auth = require('../middlewares/auth-handler');
const router = express.Router();

router.route('/').post(registerUser);
router.route('/current-user/password').patch(auth, updatePassword);
router.route('/current-user/profile-info').patch(auth, updateProfileInfo);

module.exports = router;
