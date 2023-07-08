const express = require('express');
const { login } = require('../controllers/auth-controller');
const router = express.Router();

router.route('/').post(login);
module.exports = router;
