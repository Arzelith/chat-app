const express = require('express');
const { handleRefreshToken } = require('../controllers/refresh-token-controller');
const router = express.Router();

router.route('/').get(handleRefreshToken);

module.exports = router;
