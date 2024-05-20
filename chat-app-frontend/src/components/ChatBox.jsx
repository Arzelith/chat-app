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

const ChatList= styled(List)(() => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  overflowY:'auto',
  background: 'rgba(255, 255, 255, 0.2)',
  height:'calc(100% - 133px)',
  backdropFilter: blur('5px'),
  WebkitBackdropFilter: blur('5px'),
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
      <ChatList
        ref={listInnerRef}
        sx={{pr:{xl: '15%', sm: '10%', xs: '5%'}, pl:{xl: '15%', sm: '10%', xs: '5%'}}}
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
      </ChatList>

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
