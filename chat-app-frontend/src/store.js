import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import serverErrorReducer from './features/serverErrorSlice';
import favoriteReducer from './features/favoriteSlice';
import chatReducer from './features/chatSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    error: serverErrorReducer,
    favorite: favoriteReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
