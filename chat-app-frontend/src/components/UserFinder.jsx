import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findUser } from '../features/userSlice';
import {
  getAllFavorites,
  addFavorite,
  removeFavorite,
  filterFavorites,
} from '../features/favoriteSlice';
import { setServerError } from '../features/serverErrorSlice';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
// import debounce from '../utils/debounce';
import { ActionModal, UserList } from './';
import { TextField, Box, Paper, Button, Tab } from '@mui/material';
import { TabContext, TabList } from '@mui/lab';

const UserFinder = ({ openUserFinderModal, setOpenUserFinderModal }) => {
  const [userFinder, setUserFinder] = useState('');
  const [activeTab, setActiveTab] = useState('1');
  const { userList } = useSelector((storage) => storage.user);
  const { favoriteList, filteredFavoriteList } = useSelector(
    (storage) => storage.favorite
  );

  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const handleChange = (e) => {
    setUserFinder(e.target.value);
  };
  // const debounceChange = useMemo(() => debounce(handleChange, 500));

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
  };

  const getUserList = async () => {
    try {
      await dispatch(findUser({ axiosPrivate, values: userFinder })).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  const addNewFavorite = async (userId) => {
    try {
      await dispatch(addFavorite({ axiosPrivate, values: { userId } })).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  const deleteFavorite = async (userId) => {
    try {
      await dispatch(removeFavorite({ axiosPrivate, values: { userId } })).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  const getFavoriteList = async () => {
    try {
      await dispatch(getAllFavorites({ axiosPrivate })).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  useEffect(() => {
    getFavoriteList();
  }, []);

  useEffect(() => {
    activeTab === '1' ? getUserList() : dispatch(filterFavorites(userFinder));
  }, [userFinder]);

  useEffect(() => {
    activeTab === '2' && getFavoriteList();
    setUserFinder('');
  }, [activeTab]);

  return (
    <ActionModal title={'Inicia un chat'} variant={'finder'} open={openUserFinderModal}>
      <TextField
        label='Nombre de usuario o email...'
        fullWidth
        name='userName'
        onChange={handleChange}
        autoComplete='off'
        margin='dense'
        disabled={activeTab == 2 && favoriteList.length === 0}
        value={userFinder}
      />
      <TabContext value={activeTab}>
        <Box component={Paper} variant='outlined' mt={1} mb={2} p={2}>
          <TabList onChange={handleTabChange}>
            <Tab label='Nuevo chat' value='1' />
            <Tab label='Favoritos' value='2' />
          </TabList>
          <UserList
            userList={userList}
            favoriteList={favoriteList}
            value={activeTab}
            userFinder={userFinder}
            addNewFavorite={addNewFavorite}
            deleteFavorite={deleteFavorite}
            filteredFavoriteList={filteredFavoriteList}
          />
        </Box>
      </TabContext>
      <Button
        variant='contained'
        color='error'
        size='large'
        onClick={() => setOpenUserFinderModal(false)}
      >
        Cerrar
      </Button>
    </ActionModal>
  );
};

export default UserFinder;
