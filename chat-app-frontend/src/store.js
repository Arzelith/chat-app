import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import serverErrorReducer from './features/serverErrorSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    error: serverErrorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
