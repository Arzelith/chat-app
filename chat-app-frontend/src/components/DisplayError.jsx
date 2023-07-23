import { Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice';

const DisplayError = ({ message, status }) => {
  const dispatch = useDispatch();
  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
      <Typography>{status}</Typography>
      <Typography>{message}</Typography>
      <Button
        variant='contained'
        sx={{ width: 'fit-content', mt: 1 }}
        onClick={() => dispatch(logoutUser())}
      >
        Vover a login
      </Button>
    </Box>
  );
};

export default DisplayError;
