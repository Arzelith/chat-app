import { useEffect, useRef, useState } from 'react';
import { ChatBox, EmojiPickerContainer } from './';
import { Box, TextField, Button, styled, Paper } from '@mui/material';
import { Emoji } from 'emoji-picker-react';

const SquareButton = styled(Button)(() => ({
  maxWidth: '40px',
  maxHeight: '40px',
  minWidth: '40px',
  minHeight: '40px',
}));

const MessageInput = styled(TextField)(() => ({
  height: '38px',
  padding: '4px',
}));

const ActiveChat = ({ user, chatMessages, sendNewMessage, currentChat }) => {
  const [message, setMessage] = useState('');
  const [showBack, setShowBack] = useState(false);
  const [showEmojiList, setShowEmojiList] = useState(false);
  const [emoji, setEmoji] = useState('');
  const [cursorPosition, setCursorPosition] = useState();
  const bottomElB = useRef(null);
  const formRef = useRef(null);

  const scrollToBottom = (behavior, el) => {
    el?.current?.scrollIntoView({ behavior: behavior });
  };

  useEffect(() => {
    if (currentChat._id) {
      setShowEmojiList(false);
    }
  }, [currentChat._id]);

  useEffect(() => {
    if (showBack) {
      scrollToBottom('instant', bottomElB);
    }
  }, [chatMessages.messages[0]]);

  const handleMessage = (e) => {
    e.preventDefault();
    sendNewMessage(message);
    setMessage('');
    formRef.current.message.focus();
  };

  const handleEmoji = () => {
    const messageRef = formRef.current.message;
    const start = message.substring(0, messageRef.selectionStart);
    const end = message.substring(messageRef.selectionStart);
    const emojiMessage = start + emoji + end;
    setMessage(emojiMessage);
    messageRef.selectionEnd = start.length + emoji.length;
    setCursorPosition(start.length + emoji.length);
    setEmoji('');
    formRef.current.message.focus();
  };

  useEffect(() => {
    if (emoji) {
      handleEmoji();
    }
    formRef.current.message.selectionEnd = cursorPosition;
  }, [emoji, cursorPosition]);

  return (
    <>
      <ChatBox
        user={user}
        chatMessages={chatMessages}
        currentChat={currentChat}
        showBack={showBack}
        setShowBack={setShowBack}
      />

      <Box
        display={showEmojiList ? 'block' : 'none'}
        component={Paper}
        elevation={20}
        position={'absolute'}
        height={'50%'}
        maxHeight={'450px'}
        width={{ xs: '90%', sm: '450px', md: '475px' }}
        bottom={80}
        left={10}
      >
        <EmojiPickerContainer setEmoji={setEmoji} />
      </Box>

      <Box
        component={'form'}
        position={'absolute'}
        bottom={0}
        left={0}
        width={'100%'}
        height={'72px'}
        pr={4}
        pl={4}
        display={'flex'}
        alignContent={'center'}
        justifyContent={'center'}
        bgcolor={'primary.main'}
        style={{ borderBottomRightRadius: '12px', borderBottomLeftRadius: '12px' }}
        ref={formRef}
        onSubmit={(e) => handleMessage(e)}
      >
        <Box display={'flex'} m={'auto'} flexGrow={0.8}>
          <SquareButton
            variant='contained'
            color='info'
            sx={{ mr: 1 }}
            onClick={() => {
              setShowEmojiList(!showEmojiList);
              formRef.current.message.focus();
            }}
          >
            <Emoji unified='1f642' emojiStyle='google' size={'25'} />
          </SquareButton>
          <MessageInput
            variant='standard'
            InputProps={{
              disableUnderline: true,
            }}
            fullWidth
            name='message'
            autoComplete='off'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className='MessageInput'
            sx={{ mt: 'auto', mb: 'auto' }}
            style={{ borderColor: '' }}
          />
        </Box>
      </Box>
      <div ref={bottomElB}></div>
    </>
  );
};

export default ActiveChat;
