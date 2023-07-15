import {
  TextInput,
  PageWrapper,
  ButtonInput,
  AlertDisplay,
  PaperWrapper,
} from '../components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Typography } from '@mui/material';
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
        onSubmit={(values, actions) => {
          //FAKE SUBMIT
          setTimeout(() => {
            console.log(values);
            actions.setSubmitting(false);
            actions.resetForm({ ...initialState });
          }, 3000);
          setTimeout(() => {
            actions.setFieldError('general', 'Un error genérico');
          }, 3001);
        }}
        //END FAKE SUBMIT
      >
        {({ isSubmitting, errors }) => (
          <PaperWrapper component={Form}>
            <Lottie
              animationData={logo}
              style={{ height: '80px', marginTop: '-22px' }}
              loop='false'
            />

            <Typography
              align='center'
              variant='h5'
              fontWeight={700}
              mb={1}
              color={'primary'}
            >
              Bienvenido a MERN Chat App
            </Typography>
            <AlertDisplay isSubmitting={isSubmitting} error={errors.general} />
            <TextInput
              name='email'
              label='Email'
              margin='normal'
              disabled={isSubmitting}
            />
            <TextInput
              name='password'
              label='Password'
              type='password'
              autoComplete='current-password'
              margin='normal'
              disabled={isSubmitting}
            />
            <ButtonInput size='large' sx={{ mt: 2 }} disabled={isSubmitting}>
              Iniciar sesión
            </ButtonInput>
            <ButtonInput
              size='large'
              color='success'
              type='button'
              sx={{ mt: 1 }}
              disabled={isSubmitting}
              onClick={() => console.log('action')}
            >
              Crear nueva cuenta
            </ButtonInput>
          </PaperWrapper>
        )}
      </Formik>
    </PageWrapper>
  );
};

export default Login;
