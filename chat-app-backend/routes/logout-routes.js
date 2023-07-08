const express = require('express');
const { handleLogout } = require('../controllers/logout-controller');
const router = express.Router();

router.route('/').get(handleLogout);

module.exports = router;
