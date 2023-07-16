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

const user = localStorage.getItem('MERN_CHAT_APP_USR');
const accessToken = localStorage.getItem('MERN_CHAT_APP_ACC');

const initialState = {
  user: user ? JSON.parse(user) : null,
  accessToken: accessToken ? accessToken : null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      //PENDIENTE
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authUser.fulfilled, (state, action) => {
      const { user, accessToken } = action.payload;
      setAccessAndUserData(state, accessToken, user, localStorage);
    });
  },
});

export default userSlice.reducer;
