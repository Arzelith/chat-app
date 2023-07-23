import { Container } from '@mui/material';
import { DisplayError } from './';

const PageWrapper = ({ children, serverError }) => {
  return (
    <Container
      maxWidth={'xxl'}
      sx={{
        height: '100svh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!serverError ? (
        children
      ) : (
        <DisplayError
          message={serverError.message}
          status={serverError.status}
        />
      )}
    </Container>
  );
};

export default PageWrapper;
