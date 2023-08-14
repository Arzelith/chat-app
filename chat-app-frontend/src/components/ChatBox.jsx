import React from 'react';
import { useRef, useEffect } from 'react';
import { List, Box, styled, Button } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { MessageBuble } from './';

const SquareButton = styled(Button)(() => ({
  maxWidth: '40px',
  maxHeight: '40px',
  minWidth: '40px',
  minHeight: '40px',
}));

const ChatBoxToMemo = ({ user, chatMessages, currentChat, showBack, setShowBack }) => {
  const bottomEl = useRef(null);
  const listInnerRef = useRef(null);

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
    }
  }, [chatMessages.messages[0]]);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, clientHeight } = listInnerRef.current;
      const isNearBottomB = scrollTop * -1 <= clientHeight / 2;
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

  return (
    <>
      <List
        ref={listInnerRef}
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          pl: { xl: '20%', sm: '10%', xs: '5%' },
          pr: { xl: '20%', sm: '10%', xs: '5%' },
          overflowY: 'auto',
          height: 'calc(100% - 133px)',
          backgroundColor: '#e3eefa',
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
        <SquareButton
          variant='contained'
          sx={{
            position: 'absolute',
            bottom: 120,
            right: 40,
            cursor: 'pointer',
          }}
          onClick={() => scrollToBottom('instant', bottomEl)}
        >
          <ArrowDownwardIcon />
        </SquareButton>
      )}
    </>
  );
};
const ChatBox = React.memo(ChatBoxToMemo);
export default ChatBox;
