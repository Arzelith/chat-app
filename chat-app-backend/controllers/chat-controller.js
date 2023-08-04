const Chat = require('../models/chat-model');
const Message = require('../models/message-model');
const { asyncHandler } = require('../utils/async-handler');
const ApiError = require('../errors/api-error');

const getOrCreateOneToOneChat = asyncHandler(async (req, res) => {
  try {
    const { userId, updateLatestMessage } = req.body;
    if (!userId) {
      throw new ApiError(400, 'Id de usuario no encontrada');
    }
    let chat = await Chat.findOne({
      users: { $all: [req.user._id, userId] },
    })
      .populate('users', 'displayName email avatar status isOnline')
      .populate('latestMessage');

    if (chat?.latestMessage && updateLatestMessage) {
      if (!chat?.latestMessage.readBy.includes(req.user._id)) {
        chat.latestMessage.readBy.push(req.user._id);
      }
    }

    if (chat) {
      const id = chat._id;
      await Message.updateMany(
        {
          $and: [{ chat: id }, { readBy: { $nin: [req.user._id] } }],
        },
        { $push: { readBy: req.user._id } }
      );
      return res.status(200).json({ chat });
      
    } else {
      const newChat = await Chat.create({
        users: [req.user._id, userId],
      });
      chat = await Chat.findOne({ _id: newChat._id }).populate(
        'users',
        'displayName email avatar status isOnline'
      );
      return res.status(200).json({ chat });
    }
  } catch (error) {
    console.log(error);
  }
});

const getAllOneToOneChats = asyncHandler(async (req, res) => {
  const id = req.user._id;
  if (!id) {
    throw new ApiError(400, 'Id de usuario no encontrada');
  }
  const chats = await Chat.find({ $and: [{ users: id }, { enabledBy: { $in: [id] } }] })
    .populate('users', 'displayName email avatar status isOnline')
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
