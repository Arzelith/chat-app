import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../api/axios';
import handleServerError from '../utils/serverErrorHandler';
import { clearServerError, setSessionOver } from './serverErrorSlice';
import { setAccessAndUserData, clearAccessAndUserData } from '../utils/accessDataHandler';
import { exitCurrentChat } from './chatSlice';

export const authUser = createAsyncThunk('user/authUser', async (values, thunkAPI) => {
  try {
    const { data } = await axiosPublic.post('/auth', values);
    return data;
  } catch (error) {
    return handleServerError(error, thunkAPI);
  }
});

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (values, thunkAPI) => {
    try {
      await axiosPublic.get('/logout');
      thunkAPI.dispatch(clearServerError());
      thunkAPI.dispatch(setSessionOver(false));
      thunkAPI.dispatch(exitCurrentChat());
    } catch (error) {
      thunkAPI.dispatch(clearServerError());
      thunkAPI.dispatch(setSessionOver(false));
      thunkAPI.dispatch(exitCurrentChat());

      return handleServerError(error, thunkAPI);
    }
  }
);

export const findUser = createAsyncThunk(
  'user/findUser',
  async ({ axiosPrivate, values }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.get(`/users/?search=${values}`);
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

export const updateUserEmail = createAsyncThunk(
  'user/updateUserEmail',
  async ({ axiosPrivate, values }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.patch('/users/current-user/email', values);
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  'user/updateUserAvatar',
  async ({ axiosPrivate, values }, thunkAPI) => {
    const action = values.action;
    const avatar64 = values?.avatar64;
    const chatList = values.chatList;
    try {
      const { data } = await axiosPrivate.patch(
        `/users/current-user/avatar/${action}`,
        avatar64 && { avatar64 }
      );
      const user = data;
      values.socket.emit('user update', { chatList, user });
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async ({ axiosPrivate, values }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.patch(
        `/users/current-user/?status=${values.status}`
      );
      const chatList = values.chatList;
      values.socket.emit('status changed', chatList);
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

const user = localStorage.getItem('MERN_CHAT_APP_USR');
const accessToken = localStorage.getItem('MERN_CHAT_APP_ACC');

const initialState = {
  user: user ? JSON.parse(user) : null,
  accessToken: accessToken ? accessToken : null,
  userList: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem('MERN_CHAT_APP_ACC', action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authUser.fulfilled, (state, action) => {
      const { user, accessToken } = action.payload;
      setAccessAndUserData(state, accessToken, user, localStorage);
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      clearAccessAndUserData(state, localStorage);
    });
    builder.addCase(logoutUser.rejected, (state) => {
      clearAccessAndUserData(state, localStorage);
    });
    builder.addCase(findUser.fulfilled, (state, action) => {
      if (action.payload) {
        state.userList = [...action.payload];
      }
    });
    builder.addCase(updateUserEmail.fulfilled, (state, action) => {
      const { user } = action.payload;
      setAccessAndUserData(state, null, user, localStorage);
    });
    builder.addCase(updateUserAvatar.fulfilled, (state, action) => {
      const { user } = action.payload;
      setAccessAndUserData(state, null, user, localStorage);
    });
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      const { user } = action.payload;
      setAccessAndUserData(state, null, user, localStorage);
    });
  },
});

export const { setAccessToken } = userSlice.actions;
export default userSlice.reducer;
