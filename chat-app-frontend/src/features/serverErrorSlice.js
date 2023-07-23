import { createSlice } from '@reduxjs/toolkit';

const serverError = sessionStorage.getItem('MERN_CHAT_APP_SERVER_ERROR');

const initialState = {
  serverError: serverError ? JSON.parse(serverError) : null,
};

const serverErrorSlice = createSlice({
  name: 'serverError',
  initialState,
  reducers: {
    setServerError: (state, action) => {
      const serverError = action?.payload?.payload;
      if (serverError.status !== 401 && serverError.status !== 403) {
        state.serverError = serverError;
        sessionStorage.setItem('MERN_CHAT_APP_SERVER_ERROR', JSON.stringify(serverError));
      }
    },
    clearServerError: (state) => {
      state.serverError = null;
      sessionStorage.removeItem('MERN_CHAT_APP_SERVER_ERROR');
    },
  },
});

export const { setServerError, clearServerError } = serverErrorSlice.actions;
export default serverErrorSlice.reducer;
