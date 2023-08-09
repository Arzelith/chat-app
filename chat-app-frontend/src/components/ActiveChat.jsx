import { useEffect, useRef, useState } from 'react';
import { MessageBuble } from './';
import { Box, TextField, Button, List } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const ActiveChat = ({
  user,
  chatMessages,
  setNewMessage,
  newMessage,
  sendNewMessage,
  currentChat,
  sentFlag,
}) => {
  const [showBack, setShowBack] = useState(false);
  const bottomEl = useRef(null);
  const listInnerRef = useRef(null);
  const scrollToBottom = (behavior) => {
    bottomEl?.current?.scrollIntoView({ behavior: behavior });
  };

  useEffect(() => {
    if (currentChat._id) {
      scrollToBottom('instant');
      setNewMessage('');
    }
  }, [currentChat._id]);

  useEffect(() => {
    scrollToBottom('instant');
  }, [sentFlag]);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight } = listInnerRef.current;
      const isNearBottom = scrollHeight - scrollTop <= scrollHeight;
      if (!isNearBottom) {
        setShowBack(true);
      } else {
        setShowBack(false);
      }
    }
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;
    if (listInnerElement) {
      listInnerElement.addEventListener('scroll', onScroll);
      return () => {
        listInnerElement.removeEventListener('scroll', onScroll);
      };
    }
  }, []);

  return (
    <div className='text-box'>
      <List
        ref={listInnerRef}
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          pl: { xl: '15%', sm: '10%', xs: '5%' },
          pr: { xl: '15%', sm: '10%', xs: '5%' },
        }}
        style={{ height: '100%', overflow: 'auto' }}
      >
        <div ref={bottomEl}></div>
        {chatMessages.messages.map((messageItem) => (
          <Box
            key={messageItem._id}
            display={'flex'}
            flexDirection={user._id !== messageItem.sender._id ? 'row' : 'row-reverse'}
          >
            <MessageBuble user={user} messageItem={messageItem} />
          </Box>
        ))}
      </List>
      {showBack && (
        <Button
          variant='contained'
          sx={{
            position: 'absolute',
            bottom: 120,
            right: 40,
          }}
          style={{
            maxWidth: '40px',
            maxHeight: '40px',
            minWidth: '40px',
            minHeight: '40px',
            cursor: 'pointer',
          }}
          onClick={() => scrollToBottom('instant')}
        >
          <ArrowDownwardIcon />
        </Button>
      )}
      <Box
        component={'form'}
        position={'absolute'}
        bottom={0}
        width={'100%'}
        pt={2}
        pb={2}
        pr={4}
        pl={4}
        display={'flex'}
        bgcolor={'#1976D2'}
      >
        <TextField
          variant='outlined'
          size='small'
          sx={{ flexGrow: 1, mr: 1 }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          autoComplete='off'
        />
        <Button
          variant='contained'
          color='info'
          style={{ cursor: 'pointer' }}
          type='submit'
          onClick={(e) => {
            sendNewMessage(e);
          }}
        >
          ENVIAR
        </Button>
      </Box>
    </div>
  );
};

export default ActiveChat;
