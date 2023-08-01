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
      const chatResponse = await axiosPrivate.post('/chat', { userId: values });
      return { chat: chatResponse.data };
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
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

const initialState = {
  chatList: [],
  currentChat: {},
  currentChatMessages: [],
  chatMessages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    exitCurrentChat: (state) => {
      state.currentChat = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllChats.fulfilled, (state, action) => {
      state.chatList = [...action.payload.chatList];
      state.chatMessages = [...action.payload.chatMessages];
      console.log(state.chatMessages);
    });
    builder.addCase(getOrCreateChat.fulfilled, (state, action) => {
      const chat = action.payload.chat.chat;
      const index = state.chatList.findIndex((chatItem) => chatItem._id === chat._id);
      if (index !== -1) {
        state.chatList[index] = chat;
      } else {
        state.chatList = [chat, ...state.chatList];
      }
      state.currentChat = chat;
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
export const { exitCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
