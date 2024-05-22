import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import handleServerError from '../utils/serverErrorHandler';

export const getAllFavorites = createAsyncThunk(
  'favorite/getAllFavorites',
  async ({ axiosPrivate }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.get('/favorite');
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

export const addFavorite = createAsyncThunk(
  'favorite/addFavorite',
  async ({ axiosPrivate, values }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.post('/favorite', values);
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorite/removeFavorite',
  async ({ axiosPrivate, values }, thunkAPI) => {
    try {
      const { data } = await axiosPrivate.delete('/favorite/' + values.userId);
      return data;
    } catch (error) {
      return handleServerError(error, thunkAPI);
    }
  }
);

const initialState = {
  favoriteList: [],
  filteredFavoriteList: [],
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    filterFavorites: (state, action) => {
      const filtered = state.favoriteList.filter((item) =>
        item.displayName.toLowerCase().includes(action.payload)
      );
      state.filteredFavoriteList = [...filtered];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllFavorites.fulfilled, (state, action) => {
      if (action.payload) {
        const favoriteUsers = action.payload.favorites.map((item) => item.user);
        state.favoriteList = [...favoriteUsers];
      }
    });
    builder.addCase(addFavorite.fulfilled, (state, action) => {
      if (action.payload) {
        state.favoriteList.push(action.payload.favorite.user);
      }
    });
    builder.addCase(removeFavorite.fulfilled, (state, action) => {
      const removeItemId = action.payload._id;
      const filtered = state.favoriteList.filter((item) => item._id !== removeItemId);
      state.favoriteList = [...filtered];
    });
  },
});

export const { filterFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
