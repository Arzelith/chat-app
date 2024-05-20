const express = require('express');
const { keepAlive } = require('../controllers/keep-alive-controller');
const router = express.Router();

router.route('/').get(keepAlive);
module.exports = router;
