import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { setServerError } from '../features/serverErrorSlice';
import {
  getAllChats,
  sendMessage,
  getOrCreateChat,
  setNewMessageRecieved,
} from '../features/chatSlice';
import {
  PageWrapper,
  ActionBar,
  Welcome,
  ActiveChat,
  ModalForm,
  UserFinder,
  ChatList,
} from '../components';
import { Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import io from 'socket.io-client';
const IO_ENDPOINT = import.meta.env.VITE_SOCKET_URL;
let socket;

const PaperItem = styled(Paper)(() => ({
  backgroundColor: '#fff',
  height: '94svh',
}));

const Chat = () => {
  const { user } = useSelector((storage) => storage.user);
  const { currentChat, chatMessages, chatList } = useSelector((storage) => storage.chat);
  const { serverError } = useSelector((storage) => storage.error);
  const [openFormModal, setOpenFormModal] = useState('');
  const [openUserFinderModal, setOpenUserFinderModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const [socketConnected, setSocketConnected] = useState(false);

  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const getAvailableChats = async () => {
    try {
      await dispatch(getAllChats({ axiosPrivate })).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  const sendNewMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim().length > 0) {
      try {
        await dispatch(
          sendMessage({
            axiosPrivate,
            values: { chatId: currentChat._id, content: newMessage, socket },
          })
        ).unwrap();
        const targetUser = currentChat.users.find((u) => u._id !== user._id);
        getChat(targetUser._id);
        setNewMessage('');
      } catch (error) {
        dispatch(setServerError(error));
      }
    }
  };

  const getChat = async (userId) => {
    try {
      await dispatch(
        getOrCreateChat({ axiosPrivate, values: { userId, isCurrentChat: false } })
      ).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  const getChatAndSend = async (userId, message) => {
    await getChat(userId);
    dispatch(setNewMessageRecieved({ message: message }));
  };

  useEffect(() => {
    getAvailableChats();
  }, []);

  useEffect(() => {
    socket = io(IO_ENDPOINT);
    socket.emit('setup', user);
    socket.on('connected', () => {
      setSocketConnected(true);
    });
  }, []);

  useEffect(() => {
    const setStatus = (userId) => {
      getChat(userId);
    };
    socket.on('user disconnected', setStatus);
    socket.on('user connected', setStatus);
    socket.on('new user status', setStatus);
    return () => {
      socket.off('user disconnected', setStatus);
      socket.off('user connected', setStatus);
      socket.off('new user status', setStatus);
    };
  }, []);

  useEffect(() => {
    if (user) {
      socket.emit('status changed', chatList);
    }
  }, [user.status]);

  useEffect(() => {
    if (currentChat._id) {
      const chatId = currentChat._id;
      socket.emit('enter chat', chatId);
    }
  }, [currentChat._id]);

  useEffect(() => {
    const setNewMessage = (message) => {
      const userId = message.sender._id;
      getChatAndSend(userId, message);
    };
    socket.on('new message recieved', setNewMessage);
    return () => {
      socket.off('new message recieved', setNewMessage);
    };
  }, []);

  return (
    <PageWrapper serverError={serverError} disconnect={() => socket.disconnect()}>
      <ModalForm setOpenFormModal={setOpenFormModal} openFormModal={openFormModal} />
      <UserFinder
        openUserFinderModal={openUserFinderModal}
        setOpenUserFinderModal={setOpenUserFinderModal}
      />
      <Box display={'flex'} flexDirection={'row'} width={'100%'}>
        <Box
          mr={{ xs: 0, md: 2 }}
          width={{ xs: '100%', md: 400 }}
          display={{ xs: currentChat._id ? 'none' : 'block', md: 'block' }}
        >
          <PaperItem variant='outlined'>
            <ActionBar
              variant={'left'}
              setOpenFormModal={setOpenFormModal}
              setOpenUserFinderModal={setOpenUserFinderModal}
              disconnect={() => socket.disconnect()}
              user={user}
            />
            <ChatList user={user} />
          </PaperItem>
        </Box>
        <Box
          flexGrow={1}
          display={{
            xs: currentChat._id ? 'block' : 'none',
            md: 'block',
            position: 'relative',
          }}
        >
          <PaperItem variant='outlined'>
            {currentChat._id && (
              <>
                <ActionBar
                  variant={'right'}
                  user={currentChat.users.find((item) => item._id !== user._id)}
                />
                <ActiveChat
                  chatMessages={chatMessages.find(
                    (item) => item.chat === currentChat._id
                  )}
                  user={user}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  sendNewMessage={sendNewMessage}
                  currentChat={currentChat}
                />
              </>
            )}
            {!currentChat._id && (
              <Welcome setOpenUserFinderModal={setOpenUserFinderModal} />
            )}
          </PaperItem>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default Chat;
