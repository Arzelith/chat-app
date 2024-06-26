import { Paper } from '@mui/material';

const PaperWrapper = ({ children, ...otherProps }) => {
  return (
    <Paper
      {...otherProps}
      elevation={5}
      sx={{
        p: 4,
        width: '480px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </Paper>
  );
};

export default PaperWrapper;
