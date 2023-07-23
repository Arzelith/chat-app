import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findUser } from '../features/userSlice';
import { setServerError } from '../features/serverErrorSlice';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import debounce from '../utils/debounce';
import { ActionModal } from './';
import {
  TextField,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Button,
} from '@mui/material';

const UserFinder = ({ openUserFinderModal, setOpenUserFinderModal }) => {
  const [userFinder, setUserFinder] = useState('');
  const { userList } = useSelector((storage) => storage.user);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const handleChange = (e) => {
    setUserFinder(e.target.value);
  };
  const debounceChange = useMemo(() => debounce(handleChange, 500));

  const getUsers = async () => {
    try {
      await dispatch(findUser({ axiosPrivate, values: userFinder })).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  useEffect(() => {
    if (userFinder.length > 2) {
      getUsers();
    }
  }, [userFinder]);

  return (
    <ActionModal
      title={'Inicia o encuentra un chat'}
      variant={'finder'}
      open={openUserFinderModal}
    >
      <TextField
        label='Nombre de usuario o email...'
        fullWidth
        name='userName'
        onChange={debounceChange}
      />
      <Box component={Paper} variant='outlined' mt={2} mb={2}>
        <List sx={{ overflow: 'auto', height: 300 }}>
          {userList.map((userItem) => (
            <ListItem key={userItem._id} divider disablePadding>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar src={userItem.avatar} />
                </ListItemAvatar>
                <ListItemText primary={userItem.displayName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
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
