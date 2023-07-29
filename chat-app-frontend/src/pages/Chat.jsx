import { useState } from 'react';
import { useSelector } from 'react-redux';
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

const PaperItem = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  height: '94svh',
}));

const Chat = () => {
  const { user } = useSelector((storage) => storage.user);
  const { currentChat } = useSelector((storage) => storage.chat);
  const { serverError } = useSelector((storage) => storage.error);
  const [openFormModal, setOpenFormModal] = useState('');
  const [openUserFinderModal, setOpenUserFinderModal] = useState(false);

  return (
    <PageWrapper serverError={serverError}>
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
              user={user}
            />
            <ChatList user={user} />
          </PaperItem>
        </Box>
        <Box
          flexGrow={1}
          display={{ xs: currentChat._id ? 'block' : 'none', md: 'block' }}
        >
          <PaperItem variant='outlined' sx={{ position: 'relative' }}>
            {currentChat._id && (
              <>
                <ActionBar
                  variant={'right'}
                  user={currentChat.users.find((item) => item._id !== user._id)}
                />
                <ActiveChat />
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
