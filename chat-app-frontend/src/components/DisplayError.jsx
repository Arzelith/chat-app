import { useLocation, useNavigate } from 'react-router-dom';
import { PaperWrapper } from './';
import { Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice';

const DisplayError = ({ message, status }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
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
          location.pathname === '/' ? dispatch(logoutUser()) : navigate('/');
        }}
      >
        {location.pathname === '/' ? 'Volver a login' : 'Volver a chat'}
      </Button>
    </Box>
  );
};

export default DisplayError;
