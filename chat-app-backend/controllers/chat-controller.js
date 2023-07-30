const Chat = require('../models/chat-model');
const { asyncHandler } = require('../utils/async-handler');
const ApiError = require('../errors/api-error');

const getOrCreateOneToOneChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(400, 'Id de usuario no encontrada');
  }
  let chat = await Chat.findOne({
    users: { $all: [req.user._id, userId] },
  })
    .populate('users', 'displayName email avatar status')
    .populate('latestMessage');
  if (chat.latestMessage) {
    if (!chat.latestMessage.readBy.includes(req.user._id)) {
      chat.latestMessage.readBy.push(req.user._id);
      await chat.save();
    }
  }

  if (chat) {
    return res.status(200).json({ chat });
  } else {
    const newChat = await Chat.create({
      users: [req.user._id, userId],
    });
    chat = await Chat.findOne({ _id: newChat._id }).populate(
      'users',
      'displayName email avatar status'
    );
    return res.status(200).json({ chat });
  }
});

const getAllOneToOneChats = asyncHandler(async (req, res) => {
  const id = req.user._id;
  if (!id) {
    throw new ApiError(400, 'Id de usuario no encontrada');
  }
  const chats = await Chat.find({ $and: [{ users: id }, { enabledBy: { $in: [id] } }] })
    .populate('users', 'displayName email avatar status')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });
  res.status(200).json(chats);
});

const disableChat = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  if (!chatId) {
    throw new ApiError(400, 'Id de chat no encontrada');
  }
  const chat = await Chat.findById(chatId);
  const enabledByArr = chat.enabledBy.filter(
    (user) => user._id.toString() !== req.user._id.toString()
  );
  chat.enabledBy = [...enabledByArr];
  await chat.save();
  res.status(200).json({ chat });
});

module.exports = { getOrCreateOneToOneChat, getAllOneToOneChats, disableChat };
