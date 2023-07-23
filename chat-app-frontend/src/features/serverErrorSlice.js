import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  serverError: null,
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
    clearServerError: (state) => {
      state.serverError = null;
    },
  },
});

export const { setServerError, clearServerError } = serverErrorSlice.actions;
export default serverErrorSlice.reducer;
