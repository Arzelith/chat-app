import { Alert } from '@mui/material';

const AlertDisplay = ({ error, isSubmitting, success }) => {
  return (
    <>
      {(isSubmitting || error || success) && (
        <Alert
          icon={false}
          severity={isSubmitting ? 'info' : error ? 'error' : 'success'}
          sx={{
            width: '100%',
            '& .MuiAlert-message': { textAlign: 'center', width: 'inherit' },
          }}
        >
          {isSubmitting ? 'Procesando...' : error ? `${error}` : `${success}`}
        </Alert>
      )}
    </>
  );
};

export default AlertDisplay;
