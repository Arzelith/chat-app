const express = require('express');
const { createMessage, getAllMessages } = require('../controllers/message-controller');
const auth = require('../middlewares/auth-handler');
const router = express.Router();

router.route('/').post(auth, createMessage);
router.route('/:chatId').get(auth, getAllMessages);

module.exports = router;
