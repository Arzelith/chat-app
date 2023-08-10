import { UserAvatar, CustomBadge } from './';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import { getOrCreateChat } from '../features/chatSlice';
import { setServerError } from '../features/serverErrorSlice';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Box,
  Typography,
} from '@mui/material';

import { Announcement } from '@mui/icons-material';

const ChatList = ({ user, currentChat }) => {
  const { chatList } = useSelector((storage) => storage.chat);
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();

  const correctUser = (chatItem) => {
    const index = chatItem.users.findIndex((item) => item._id !== user._id);
    return chatItem.users[index];
  };

  const latestMessageText = (chatItem) => {
    const latestMessage = chatItem?.latestMessage?.content;
    if (latestMessage) {
      return latestMessage.length > 20
        ? latestMessage.substring(0, 18) + '...'
        : latestMessage;
    }
    return '';
  };

  const enterChat = async (values) => {
    try {
      await dispatch(getOrCreateChat({ axiosPrivate, values })).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  return (
    <List className='' sx={{ pt: 0, overflowY: 'auto', height: '85svh' }}>
      {chatList.map((chatItem) => (
        <Box key={chatItem._id}>
          {chatItem?.latestMessage?.content && (
            <ListItem divider disableGutters disablePadding>
              <ListItemButton
                onClick={() => {
                  enterChat({
                    userId: correctUser(chatItem)._id,
                    isCurrentChat: true,
                    updateLatestMessage: true,
                  });
                }}
              >
                <ListItemAvatar>
                  <CustomBadge
                    top={34}
                    height={'12px'}
                    width={'12px'}
                    overlap='circular'
                    variant='dot'
                    user={correctUser(chatItem)}
                  >
                    <UserAvatar
                      avatar={correctUser(chatItem).avatar}
                      displayName={correctUser(chatItem).displayName}
                    />
                  </CustomBadge>
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  secondary={
                    <Typography variant='body2'>{latestMessageText(chatItem)}</Typography>
                  }
                  primary={
                    <Typography variant='body1' fontWeight={'bold'} color={'primary'}>
                      {correctUser(chatItem).displayName}
                    </Typography>
                  }
                />

                {!chatItem.latestMessage.readBy.includes(user._id) &&
                  currentChat._id !== chatItem._id && (
                    <ListItemIcon>
                      <Announcement sx={{ fill: '#2eb860' }} fontSize='large' />
                    </ListItemIcon>
                  )}
              </ListItemButton>
            </ListItem>
          )}
        </Box>
      ))}
    </List>
  );
};

export default ChatList;
