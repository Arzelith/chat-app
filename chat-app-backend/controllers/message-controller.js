const Message = require('../models/message-model');
const Chat = require('../models/chat-model');
const { asyncHandler } = require('../utils/async-handler');
const ApiError = require('../errors/api-error');

const createMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!chatId) {
    throw new ApiError(400, 'Id de chat no encontrada');
  }
  if (!content) {
    throw new ApiError(400, 'Mensaje debe tener contenido');
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(404, 'Caht no encontrado');
  }
  let message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
    readBy: [req.user._id],
  });
  message = await message.populate('sender', 'displayName email avatar status');
  message = await message.populate('chat');
  message = await message.populate({ path: 'chat.users', model: 'User', select: '_id' });

  chat.latestMessage = message;
  chat.enabledBy = [...chat.users];
  await chat.save();
  res.status(201).json({ message });
});


const getAllMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  if (!chatId) {
    throw new ApiError(400, 'Id de chat no encontrada');
  }
  const messages = await Message.find({ chat: chatId })
    .populate('sender', 'displayName email avatar status')
    .populate('chat');
  // const chat = await Chat.findById(chatId);
  // if (!chat.enabledBy.includes(req.user._id.toString())) {
  //   chat.enabledBy.push(req.user._id);
  //   await chat.save();
  // }
  res.status(200).json(messages);
});

module.exports = { createMessage, getAllMessages };
