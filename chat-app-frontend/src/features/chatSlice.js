import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import handleServerError from '../utils/serverErrorHandler';

export const getAllChats = createAsyncThunk(
  'chat/getAllChats',
  async ({ axiosPrivate }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.get('/chat');
      const chatIds = data.map((item) => item._id);
      let chatMessages = [];
      await Promise.all(
        chatIds.map((obj) =>
          axiosPrivate.get('/message/' + obj).then((response) => {
            chatMessages.push({ chat: obj, messages: response.data });
          })
        )
      );
      return { chatList: data, chatMessages };
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

export const getOrCreateChat = createAsyncThunk(
  'chat/getOrCreateChat',
  async ({ axiosPrivate, values }, thunkAPI) => {
    try {
      const chatResponse = await axiosPrivate.post('/chat', {
        userId: values.userId,
        updateLatestMessage: values.updateLatestMessage,
      });
      return { chat: chatResponse.data, isCurrentChat: values.isCurrentChat };
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ axiosPrivate, values }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.post('/message', {
        chatId: values.chatId,
        content: values.content,
      });
      values.socket.emit('new message', data);
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

const initialState = {
  chatList: [],
  currentChat: {},
  // currentChatMessages: [],
  chatMessages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    exitCurrentChat: (state) => {
      state.currentChat = {};
    },
    setNewMessageRecieved: (state, action) => {
      const chatId = action.payload.message.chat._id;
      const newMessage = action.payload.message;
      state.chatMessages
        .find((item) => item.chat === chatId)
        .messages.unshift(newMessage);
      const reordered = state.chatList.filter((chatItem) => chatItem._id !== chatId);
      const chat = state.chatList.find((chat) => chat._id === chatId);
      reordered.unshift(chat);
      state.chatList = [...reordered];
    },
    setUpdatedChatUser: (state, action) => {
      const updatedUser = action.payload;
      const chatIndex = state.chatList.findIndex((c) =>
        c.users.find((u) => u._id === updatedUser._id)
      );
      if (chatIndex !== -1) {
        const userIndex = state.chatList[chatIndex].users.findIndex(
          (u) => u._id === updatedUser._id
        );
        if (userIndex !== -1) {
          state.chatList[chatIndex].users[userIndex] = updatedUser;
          if (state.currentChat._id === state.chatList[chatIndex]._id) {
            state.currentChat.users[userIndex] = updatedUser;
          }
          const chatMessageIndex = state.chatMessages.findIndex(
            (cm) => cm.chat === state.chatList[chatIndex]._id
          );
          if (chatMessageIndex !== -1) {
            state.chatMessages[chatMessageIndex].messages.forEach((m) => {
              if (m.sender._id === updatedUser._id) {
                m.sender = updatedUser;
              }
            });
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllChats.fulfilled, (state, action) => {
      state.chatList = [...action.payload.chatList];
      state.chatMessages = [...action.payload.chatMessages];
    });
    builder.addCase(getOrCreateChat.fulfilled, (state, action) => {
      const chat = action.payload.chat.chat;
      const index = state.chatList.findIndex((chatItem) => chatItem._id === chat._id);
      const isMessage = state.chatMessages.findIndex(
        (messageItem) => messageItem.chat === chat._id
      );
      if (index !== -1) {
        state.chatList[index] = chat;
      } else {
        state.chatList = [chat, ...state.chatList];
      }
      if (isMessage === -1) {
        state.chatMessages.push({ chat: chat._id, messages: [] });
      }
      if (action.payload?.isCurrentChat) {
        state.currentChat = chat;
      }
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      const newMessage = action.payload.message;
      const chatId = action.payload.message.chat._id;
      state.chatMessages
        .find((item) => item.chat === chatId)
        .messages.unshift(newMessage);
    });
  },
});
export const { exitCurrentChat, setNewMessageRecieved, setUpdatedChatUser } =
  chatSlice.actions;
export default chatSlice.reducer;
