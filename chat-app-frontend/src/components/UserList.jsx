import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useDispatch } from 'react-redux';
import { getOrCreateChat } from '../features/chatSlice';
import { setServerError } from '../features/serverErrorSlice';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  ListItemButton,
} from '@mui/material';
import { UserAvatar } from './';
import { StarBorder, Star } from '@mui/icons-material';
import { TabPanel } from '@mui/lab';

const UserList = ({
  userList,
  favoriteList,
  value,
  addNewFavorite,
  deleteFavorite,
  userFinder,
  filteredFavoriteList,
  setOpenUserFinderModal,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();

  const isFavorite = (userItem) => {
    const index = favoriteList.findIndex((object) => object?._id === userItem?._id);
    return index;
  };

  const rightList = () => {
    if (value === '2') {
      if (userFinder.length > 0) {
        return filteredFavoriteList;
      }
      return favoriteList;
    }
    if (value === '1') {
      if (userFinder.length > 0) {
        return userList;
      }
      return [];
    }
  };

  const enterChat = async (values) => {
    try {
      await dispatch(getOrCreateChat({ axiosPrivate, values })).unwrap();
      setOpenUserFinderModal(false);
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  return (
    <List sx={{ overflow: 'auto', height: 300 }}>
      <TabPanel value={value} sx={{ p: 0 }}>
        {rightList().length > 0 ? (
          <>
            <Divider />
            {rightList().map((userItem) => (
              <ListItem key={userItem._id} divider disablePadding>
                <ListItemButton onClick={() => enterChat(userItem._id)}>
                  <ListItemAvatar>
                    <UserAvatar
                      avatar={userItem.avatar}
                      displayName={userItem.displayName}
                    ></UserAvatar>
                  </ListItemAvatar>
                  <ListItemText primary={userItem.displayName} />
                </ListItemButton>
                <Box position={'absolute'} right={10}>
                  {isFavorite(userItem) !== -1 ? (
                    <IconButton onClick={() => deleteFavorite(userItem._id)}>
                      <Star color='primary' />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => addNewFavorite(userItem._id)}>
                      <StarBorder />
                    </IconButton>
                  )}
                </Box>
              </ListItem>
            ))}
          </>
        ) : (
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            height={284}
          >
            {userList.length === 0 && value === '1' && (
              <Typography>Busque usuarios para iniciar un chat</Typography>
            )}
            {favoriteList.length === 0 && value === '2' && (
              <Typography>No existen usuarios registrados</Typography>
            )}
          </Box>
        )}
      </TabPanel>
    </List>
  );
};

export default UserList;
