const express = require('express');
const { registerUser, updatePassword } = require('../controllers/user-controller');
const auth = require('../middlewares/auth-handler');
const router = express.Router();

router.route('/').post(registerUser);
router.route('/current-user/password').patch(auth, updatePassword);

module.exports = router;
