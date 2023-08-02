import { Container } from '@mui/material';
import { DisplayError, ActionModal } from './';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice';

const PageWrapper = ({ children, serverError, disconnect }) => {
  const { sessionOver } = useSelector((storage) => storage.error);
  const dispatch = useDispatch();
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
        <>
          <ActionModal
            open={sessionOver}
            title={'Su sesión ha caducado'}
            variant={'sessionOver'}
            onClick={() => {
              dispatch(logoutUser());
              disconnect();
            }}
            acceptBtnText={'Volver a login'}
          />
          {children}
        </>
      ) : (
        <DisplayError message={serverError.statusText} status={serverError.status} />
      )}
    </Container>
  );
};

export default PageWrapper;
