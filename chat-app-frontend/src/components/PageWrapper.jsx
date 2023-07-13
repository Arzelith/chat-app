import { Container } from '@mui/material';

const PageWrapper = ({children}) => {
  return (
    <Container
      sx={{
        height: '100svh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </Container>
  );
};

export default PageWrapper;
