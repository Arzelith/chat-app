import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../api/axios';
import handleServerError from '../utils/serverErrorHandler';
import { setAccessAndUserData, clearAccessAndUserData } from '../utils/accessDataHandler';

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
    } catch (error) {
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
      state.userList = [...action.payload];
    });
  },
});

export const { setAccessToken } = userSlice.actions;
export default userSlice.reducer;
