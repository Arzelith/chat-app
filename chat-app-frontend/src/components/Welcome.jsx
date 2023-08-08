import { Box, Typography, Button } from '@mui/material';
import Lottie from 'lottie-react';
import logo from '../assets/animations/logoA.json';

const Welcome = ({ setOpenUserFinderModal }) => {
  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      width={'100%'}
      height={'100%'}
    >
      <Lottie animationData={logo} style={{ height: '320px' }} loop={false} />
      <Typography
        mb={5}
        pl={2}
        pr={2}
        variant='h5'
        color={'primary'}
        flexWrap={'wrap'}
        maxWidth={600}
        textAlign={'center'}
      >
        Selecciona un chat desde la lista a la izquiera o crea uno nuevo para iniciar una
        conversación.
      </Typography>
      <Button
        variant='contained'
        size='large'
        onClick={() => setOpenUserFinderModal(true)}
      >
        Iniciar nuevo chat
      </Button>
    </Box>
  );
};

export default Welcome;
