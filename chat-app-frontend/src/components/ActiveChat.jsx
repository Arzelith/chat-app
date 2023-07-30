import { MessageBuble } from './';
import { Box, TextField, Button, Container, List, CircularProgress } from '@mui/material';

const ActiveChat = ({ currentChatMessages, loadingMessages, user }) => {
  return (
    <div className='text-box'>
      {loadingMessages ? (
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          height={'100%'}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Container maxWidth='lg'>
          <List sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
            {currentChatMessages.map((messageItem) => (
              <Box
                key={messageItem._id}
                display={'flex'}
                flexDirection={
                  user._id !== messageItem.sender._id ? 'row' : 'row-reverse'
                }
              >
                <MessageBuble user={user} messageItem={messageItem} />
              </Box>
            ))}
          </List>
        </Container>
      )}
      <Box
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
        <TextField variant='outlined' size='small' sx={{ flexGrow: 1, mr: 1 }} />
        <Button variant='contained' color='info'>
          ENVIAR
        </Button>
      </Box>
    </div>
  );
};

export default ActiveChat;
