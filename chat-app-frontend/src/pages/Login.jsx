import { TextInput, PageWrapper, ButtonInput } from '../components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Paper, Typography, Box } from '@mui/material';
import Lottie from 'lottie-react';
import logo from '../assets/animations/logoA.json';

const initialState = {
  email: '',
  password: '',
};
const validation = Yup.object().shape({
  password: Yup.string().required('password es requerido'),
  email: Yup.string().email('email inválido').required('email es requerido'),
});

const Login = () => {
  return (
    <PageWrapper>
      <Formik
        initialValues={{ ...initialState }}
        validationSchema={validation}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <Paper
          component={Form}
          variant='outlined'
          sx={{
            p: 4,
            width: '480px',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Lottie animationData={logo} style={{ height: '80px', marginTop:'-22px' }} loop='false' />
          <Typography align='center' variant='h5' fontWeight={700} mb={1} color={'primary'}>
            Bienvenido a MERN Chat App
          </Typography>
          <TextInput name='email' label='Email' margin='normal' />
          <TextInput name='password' label='Password' margin='normal' />
          <ButtonInput size='large' sx={{ mt: 2 }}>
            Iniciar sesión
          </ButtonInput>
          <ButtonInput
            size='large'
            color='success'
            type='button'
            sx={{ mt: 1 }}
            onClick={() => console.log('action')}
          >
            Crear nueva cuenta
          </ButtonInput>
        </Paper>
      </Formik>
    </PageWrapper>
  );
};

export default Login;
