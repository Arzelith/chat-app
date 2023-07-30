import { UserAvatar } from './';
import { Box, Paper, Typography } from '@mui/material';

const MessageBuble = ({ user, messageItem }) => {
  return (
    <Box
      display={'flex'}
      flexDirection={user._id !== messageItem.sender._id ? 'row' : 'row-reverse'}
      mb={2}
      mt={1}
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
        p={1}
        ml={0.5}
        mr={0.5}
        display={'flex'}
        flexDirection={'column'}
      >
        {user._id !== messageItem.sender._id && (
          <Typography variant='body2' fontWeight={'bold'} mb={0.2}>
            {messageItem.sender.displayName + ':'}
          </Typography>
        )}

        <Typography
          variant='body2'
          sx={{ wordBreak: 'break-word' }}
          textAlign={user._id !== messageItem.sender._id ? 'left' : 'right'}
          width={'100%'}
        >
          {messageItem.content}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBuble;
