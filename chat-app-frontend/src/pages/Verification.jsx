import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper, PaperWrapper } from '../components';
import { axiosPublic } from '../api/axios';
import { Typography, CircularProgress, Button } from '@mui/material';

const Verification = () => {
  const [isLoading, setIsloading] = useState(false);
  const [isUserVerified, setUserVerified] = useState(true);
  const { userId, token } = useParams();
  const navigate = useNavigate();

  const confirmAccount = async () => {
    try {
      setIsloading(true);
      const response = await axiosPublic.get(`/users/${userId}/verify/${token}`);
      if (response.status === 200) {
        setIsloading(false);
        setUserVerified(true);
      }
    } catch (error) {
      setIsloading(false);
      setUserVerified(false);
    }
  };

  useEffect(() => {
    confirmAccount();
  }, []);

  return (
    <PageWrapper>
      <PaperWrapper>
        {isLoading && (
          <>
            <CircularProgress size={60} sx={{ ml: 'auto', mr: 'auto', mt: 1 }} />
            <Typography
              variant='body2'
              fontWeight={'bold'}
              ml={'auto'}
              mr={'auto'}
              mt={2}
              color={'primary'}
            >
              verificando su cuenta...
            </Typography>
          </>
        )}
        {isUserVerified && !isLoading && (
          <>
            <Typography
              variant='h4'
              fontWeight={'bold'}
              color={'primary'}
              align='center'
              mb={1}
            >
              Verificación exitosa
            </Typography>
            <Typography
              variant='p'
              fontWeight={''}
              color={'primary'}
              align='center'
              mb={0}
            >
              Inicie sesión con su cuenta de usuario y contraseña
            </Typography>
          </>
        )}
        {!isUserVerified && !isLoading && (
          <Typography
            variant='h4'
            fontWeight={'bold'}
            color={'primary'}
            align='center'
            mb={1}
          >
            Vínculo inválido
          </Typography>
        )}
        {!isLoading && (
          <Button
            variant='contained'
            onClick={() => navigate('/')}
            sx={{ width: 'fit-content', mt: 2, ml: 'auto', mr: 'auto' }}
          >
            Volver al Indice
          </Button>
        )}
      </PaperWrapper>
    </PageWrapper>
  );
};

export default Verification;
