import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import handleServerError from '../utils/serverErrorHandler';

export const getAllChats = createAsyncThunk(
  'chat/getAllChats',
  async ({ axiosPrivate }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.get('/chat');
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

export const getOrCreateChat = createAsyncThunk(
  'chat/getOrCreateChat',
  async ({ axiosPrivate, values }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.post('/chat', { userId: values });
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

const initialState = {
  chatList: [],
  currentChat: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllChats.fulfilled, (state, action) => {
      state.chatList = [...action.payload];
    });
    builder.addCase(getOrCreateChat.fulfilled, (state, action) => {
      const chat = action.payload.chat;
      const index = state.chatList.findIndex((chatItem) => chatItem._id === chat._id);
      if (index !== -1) {
        state.chatList[index] = chat;
      } else {
        state.chatList = [chat, ...state.chatList];
      }
      state.currentChat = chat;
    });
  },
});

export default chatSlice.reducer;
