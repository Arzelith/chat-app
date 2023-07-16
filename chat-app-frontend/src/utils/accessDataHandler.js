export const setAccessAndUserData = (state, tokenPayload, userPayload, storage) => {
  storage.setItem('MERN_CHAT_APP_USR', JSON.stringify(userPayload));
  if (tokenPayload !== null) {
    storage.setItem('MERN_CHAT_APP_ACC', tokenPayload);
    state.accessToken = storage.getItem('MERN_CHAT_APP_ACC');
    const user = storage.getItem('MERN_CHAT_APP_USR');
    state.user = JSON.parse(user);
  }
};

export const clearAccessAndUserData = (state, storage) => {
  storage.clear();
  state.user = null;
  state.accessToken = null;
};
