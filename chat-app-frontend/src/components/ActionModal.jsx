import { Modal, Paper, Typography, Button } from '@mui/material';

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
};

const ActionModal = ({ open, children, variant, onClick, title, acceptBtnText }) => {
  if (variant === 'success') {
    return (
      <Modal open={open}>
        <Paper sx={style} variant='outlined' className='modal'>
          <Typography variant='h4' fontWeight={'bold'} color={'primary'} mb={2}>
            {title}
          </Typography>
          <Button
            size='md'
            type='button'
            variant='contained'
            color={'success'}
            sx={{ width: 'fit-content' }}
            onClick={onClick}
          >
            {acceptBtnText}
          </Button>
        </Paper>
      </Modal>
    );
  }
};

export default ActionModal;