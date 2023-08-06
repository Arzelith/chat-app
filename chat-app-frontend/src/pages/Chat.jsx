import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { setServerError } from '../features/serverErrorSlice';
import {
  getAllChats,
  sendMessage,
  getOrCreateChat,
  setNewMessageRecieved,
  setUpdatedChatUser,
  setPendingMessage,
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
let selectedChat;

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
      dispatch(
        setPendingMessage({
          chatId: currentChat._id,
          content: newMessage,
          sender: user,
          readBy: [user._id],
          _id:uuidv4()
        })
      );
      const message = newMessage;
      setNewMessage('');
      try {
        await dispatch(
          sendMessage({
            axiosPrivate,
            values: { chatId: currentChat._id, content: message, socket },
          })
        ).unwrap();
        const targetUser = currentChat.users.find((u) => u._id !== user._id);
        getChat(targetUser._id, true);
      } catch (error) {
        dispatch(setServerError(error));
      }
    }
  };

  const getChat = async (userId, updateLatestMessage) => {
    try {
      await dispatch(
        getOrCreateChat({
          axiosPrivate,
          values: {
            userId,
            isCurrentChat: false,
            updateLatestMessage: updateLatestMessage,
          },
        })
      ).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  const getChatAndSend = async (userId, message, chatId) => {
    const updateLatestMessage = chatId === selectedChat;
    await getChat(userId, updateLatestMessage);
    dispatch(setNewMessageRecieved({ message: message }));
  };

  useEffect(() => {
    getAvailableChats();
  }, []);

  useEffect(() => {
    selectedChat = currentChat._id;
  }, [currentChat]);

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
    const updateChatUser = (user) => {
      dispatch(setUpdatedChatUser(user));
    };
    const setNewMessage = (message) => {
      const userId = message.sender._id;
      const chatId = message.chat._id;
      getChatAndSend(userId, message, chatId);
    };

    socket.on('user disconnected', setStatus);
    socket.on('user connected', setStatus);
    socket.on('new user status', setStatus);
    socket.on('user updated', updateChatUser);
    socket.on('new message recieved', setNewMessage);
    return () => {
      socket.off('user disconnected', setStatus);
      socket.off('user connected', setStatus);
      socket.off('new user status', setStatus);
      socket.off('user updated', updateChatUser);
      socket.off('new message recieved', setNewMessage);
    };
  }, []);

  return (
    <PageWrapper serverError={serverError} disconnect={() => socket.disconnect()}>
      <ModalForm
        setOpenFormModal={setOpenFormModal}
        openFormModal={openFormModal}
        socket={socket}
        chatList={chatList}
      />
      <UserFinder
        openUserFinderModal={openUserFinderModal}
        setOpenUserFinderModal={setOpenUserFinderModal}
      />
      <Box display={'flex'} flexDirection={'row'} width={'100%'}>
        <Box
          mr={{ xs: 0, md: 2 }}
          width={{ xs: '100%', md: '600px', }}
          display={{ xs: currentChat._id ? 'none' : 'block', md: 'block' }}
        >
          <PaperItem variant='outlined'>
            <ActionBar
              variant={'left'}
              setOpenFormModal={setOpenFormModal}
              setOpenUserFinderModal={setOpenUserFinderModal}
              disconnect={() => socket.disconnect()}
              user={user}
              socket={socket}
              chatList={chatList}
            />
            <ChatList user={user} currentChat={currentChat} />
          </PaperItem>
        </Box>
        <Box
          width={'100%'}
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
