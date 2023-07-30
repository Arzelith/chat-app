import { useEffect } from 'react';
import { MessageBuble } from './';
import { Box, TextField, Button, List } from '@mui/material';

const ActiveChat = ({
  user,
  chatMessages,
  setNewMessage,
  newMessage,
  sendNewMessage,
  currentChat,
}) => {
  useEffect(() => {
    if (currentChat._id) {
      setNewMessage('');
    }
  }, [currentChat._id]);
  return (
    <div className='text-box'>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          height: '100%',
          pl: '10%',
          pr: '10%',
        }}
        className='text-box'
      >
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
        onSubmit={(e) => sendNewMessage(e)}
      >
        <TextField
          variant='outlined'
          size='small'
          sx={{ flexGrow: 1, mr: 1 }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant='contained' color='info' type='submit'>
          ENVIAR
        </Button>
      </Box>
    </div>
  );
};

export default ActiveChat;
