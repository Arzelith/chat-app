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
  Divider,
  Badge,
  ListItemIcon,
  Box,
} from '@mui/material';

const ChatList = ({ user }) => {
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
    <List className='chat-list'>
      <Divider />
      {chatList.map((chatItem) => (
        <Box key={chatItem._id}>
          {chatItem?.latestMessage?.content && (
            <ListItem divider disableGutters disablePadding>
              <ListItemButton onClick={() => enterChat(correctUser(chatItem)._id)}>
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
                  secondary={latestMessageText(chatItem)}
                  sx={{ fontWeight: 700 }}
                >
                  {correctUser(chatItem).displayName}
                </ListItemText>
                <ListItemIcon>
                  <Badge badgeContent={'nuevos!'} color='primary' />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )}
        </Box>
      ))}
    </List>
  );
};

export default ChatList;