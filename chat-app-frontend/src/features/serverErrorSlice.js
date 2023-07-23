import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  serverError: null,
  sessionOver: false,
};

const serverErrorSlice = createSlice({
  name: 'serverError',
  initialState,
  reducers: {
    setServerError: (state, action) => {
      const serverError = action.payload;
      if (serverError.status !== 401 && serverError.status !== 403) {
        state.serverError = serverError;
      }
    },
    setSessionOver: (state, action) => {
      state.sessionOver = action.payload;
    },
    clearServerError: (state) => {
      state.serverError = null;
    },
  },
});

export const { setServerError, clearServerError, setSessionOver } = serverErrorSlice.actions;
export default serverErrorSlice.reducer;
