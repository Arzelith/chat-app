import { useState, useEffect } from 'react';
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
    const target = e.target.value;
    setUserFinder(target);
    activeTab === '1' ? getUserList(target) : dispatch(filterFavorites(target));
  };

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
  };

  const getUserList = async (target) => {
    try {
      await dispatch(findUser({ axiosPrivate, values: target })).unwrap();
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
            <Tab label='Nuevo chat' value='1' onClick={() => setUserFinder('')} />
            <Tab
              label='Favoritos'
              value='2'
              onClick={() => {
                getFavoriteList();
                setUserFinder('');
              }}
            />
          </TabList>
          <UserList
            userList={userList}
            favoriteList={favoriteList}
            value={activeTab}
            userFinder={userFinder}
            addNewFavorite={addNewFavorite}
            deleteFavorite={deleteFavorite}
            filteredFavoriteList={filteredFavoriteList}
            setOpenUserFinderModal={setOpenUserFinderModal}
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
