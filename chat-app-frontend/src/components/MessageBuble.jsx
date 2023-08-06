import { UserAvatar } from './';
import { Box, Paper, Typography } from '@mui/material';

const MessageBuble = ({ user, messageItem }) => {
  return (
    <Box
      display={'flex'}
      flexDirection={user._id !== messageItem.sender._id ? 'row' : 'row-reverse'}
      mb={2}
      mt={1}
      maxWidth={'60%'}
    >
      {user._id !== messageItem.sender._id && (
        <UserAvatar
          displayName={messageItem.sender.displayName}
          avatar={messageItem.sender.avatar}
          height={35}
          width={35}
        />
      )}
      <Box
        component={Paper}
        variant='outlined'
        pt={0.5}
        pb={0.5}
        pr={1}
        pl={1}
        ml={0.5}
        mr={0.5}
        display={'flex'}
        bgcolor={user._id === messageItem.sender._id && '#D7FAD1'}
        flexDirection={'column'}
      >
        {user._id !== messageItem.sender._id && (
          <Typography variant='body2' fontWeight={'bold'} color={'primary'}>
            {messageItem.sender.displayName + ':'}
          </Typography>
        )}

        <Typography
          variant='body2'
          sx={{ wordBreak: 'break-word' }}
          pt={0.3}
          width={'100%'}
        >
          {messageItem.content}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBuble;
