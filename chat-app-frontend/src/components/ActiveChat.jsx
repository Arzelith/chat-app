import { useEffect, useRef, useState } from 'react';
import { MessageBuble } from './';
import { Box, TextField, Button, List } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const ActiveChat = ({ user, chatMessages, sendNewMessage, currentChat }) => {
  const [showBack, setShowBack] = useState(false);
  const bottomEl = useRef(null);
  const bottomElB = useRef(null);
  const listInnerRef = useRef(null);
  const formRef = useRef(null);
  const messageRef = useRef(null);

  const scrollToBottom = (behavior, el) => {
    el?.current?.scrollIntoView({ behavior: behavior });
  };

  useEffect(() => {
    if (currentChat._id) {
      scrollToBottom('instant');
    }
  }, [currentChat._id]);

  useEffect(() => {
    if (!showBack) {
      scrollToBottom('instant', bottomEl);
    }else{
      scrollToBottom('instant', bottomElB);
    }
  }, [chatMessages.messages[0]]);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, clientHeight } = listInnerRef.current;
      const isNearBottomB = (scrollTop * -1) <= clientHeight/2;
      if (!isNearBottomB) {
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

  const handleMessage = (e) => {
    e.preventDefault();
    const newMessage = formRef.current.message.value;
    sendNewMessage(newMessage);
    formRef.current.reset();
    formRef.current.message.focus();
  };

  return (
    <>
      <List
        ref={listInnerRef}
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          pl: { xl: '15%', sm: '10%', xs: '5%' },
          pr: { xl: '15%', sm: '10%', xs: '5%' },
          overflowY:'auto',
          height:'77svh'
        }}
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
          onClick={() => scrollToBottom('instant', bottomEl)}
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
        ref={formRef}
        onSubmit={(e) => handleMessage(e)}
      >
        <TextField
          variant='outlined'
          size='small'
          sx={{ flexGrow: 0.9, mr: 'auto', ml: 'auto' }}
          name='message'
          autoComplete='off'
          ref={messageRef}
        />
      </Box>
      <div ref={bottomElB}></div>
    </>
  );
};

export default ActiveChat;
