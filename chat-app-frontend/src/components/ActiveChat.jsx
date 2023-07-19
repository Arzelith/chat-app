import { Box, TextField, Button } from '@mui/material';

const ActiveChat = () => {
  return (
    <div className='text-box'>
      mensajes
      <Box
        position={'absolute'}
        bottom={0}
        width={'100%'}
        pt={1}
        pb={1}
        pr={4}
        pl={4}
        display={'flex'}
        bgcolor={'#1976D2'}
      >
        <TextField variant='outlined' sx={{ flexGrow: 1, mr: 2, fontSize: '50px' }} />
        <Button variant='contained' color='info'>
          ENVIAR
        </Button>
      </Box>
    </div>
  );
};

export default ActiveChat;
