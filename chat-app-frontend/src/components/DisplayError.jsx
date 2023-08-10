import { useLocation } from 'react-router-dom';
import { PaperWrapper } from './';
import { Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice';

const DisplayError = ({ message, status, disconnect }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const refresh = () => {
    if (status >= 500 && location.pathname === '/') {
      dispatch(logoutUser());
      disconnect();
    } else {
      window.location.reload(false);
    }
  };
  return (
    <Box component={PaperWrapper} alignItems={'center'}>
      <Typography variant='h4' fontWeight={'bold'}>
        {status}
      </Typography>
      <Typography variant='h5' fontWeight={'bold'}>
        {message}
      </Typography>
      <Button
        variant='contained'
        size='large'
        sx={{ width: 'fit-content', mt: 2 }}
        onClick={() => {
          refresh();
        }}
      >
        Aceptar
      </Button>
    </Box>
  );
};

export default DisplayError;
