const express = require('express');
const {
  getAllOneToOneChats,
  getOrCreateOneToOneChat,
  disableChat,
} = require('../controllers/chat-controller');
const auth = require('../middlewares/auth-handler');
const router = express.Router();

router.route('/').post(auth, getOrCreateOneToOneChat).get(auth, getAllOneToOneChats);
router.route('/disable/:chatId').patch(auth, disableChat);

module.exports = router;
