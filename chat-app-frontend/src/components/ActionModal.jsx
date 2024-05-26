import { Modal, Paper, Typography, Button, Box } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  textAlign: 'center',
  p: 2,
  maxWidth: 480,
  width: '90%',
  outline: 'none',
};

const ActionModal = ({
  open,
  children,
  variant,
  onClick,
  title,
  acceptBtnText,
  body,
}) => {
  return (
    <Modal open={open}>
      <Paper sx={style} variant='outlined' className='modal'>
        <Typography variant='h4' fontWeight={'bold'} color={'primary'} mb={1} mt={1}>
          {title}
        </Typography>
        {body && (
          <Box sx={{marginTop:1, marginBottom:1}}>
            <Typography
              variant='p'
              fontWeight={''}
              color={'primary'}
            >
              {body}
            </Typography>
          </Box>
        )}
        {(variant === 'success' || variant === 'sessionOver') && (
          <Button
            size='md'
            type='button'
            variant='contained'
            color={variant === 'success' ? 'success' : 'primary'}
            sx={{ width: 'fit-content', mt: 1 }}
            onClick={onClick}
          >
            {acceptBtnText}
          </Button>
        )}
        {(variant === 'form' || variant === 'finder') && children}
      </Paper>
    </Modal>
  );
};

export default ActionModal;
