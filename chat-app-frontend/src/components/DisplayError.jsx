import { useLocation, useNavigate } from 'react-router-dom';
import { PaperWrapper } from './';
import { Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice';

const DisplayError = ({ message, status, disconnect }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const refresh = () => {
    if (status >= 500 && location.pathname === '/') {
      dispatch(logoutUser());
      disconnect();
    }
    if (status == 404 && location.pathname !== '/') {
      navigate('/');
    } else {
      window.location.reload(false);
    }
  };
  return (
    <Box component={PaperWrapper} alignItems={'center'} sx={{p:3}}>
      <Typography variant='h4' fontWeight={'bold'} color={'primary'}>
        {status}
      </Typography>
      <Typography variant='h5' fontWeight={'bold'} color={'primary'}>
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
