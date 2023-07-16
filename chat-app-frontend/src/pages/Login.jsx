import { useState } from 'react';
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
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};
const loginValidation = Yup.object().shape({
  password: Yup.string().required('password es requerido'),
  email: Yup.string().email('email inválido').required('email es requerido'),
});

const registerValidation = Yup.object().shape({
  displayName: Yup.string()
    .required('nombre de usuario es requerido')
    .min(3, 'nombre de usuario debe tener entre 3 y 20 caracteres')
    .max(20, 'nombre de usuario debe tener entre 3 y 20 caracteres'),
  email: Yup.string().email('email inválido').required('email es requerido'),
  password: Yup.string()
    .required('password es requerido')
    .min(6, 'password debe tener entre 6 y 20 caracteres')
    .max(20, 'password debe tener entre 6 y 20 caracteres'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'passwords no concuerdan'
  ),
});

const Login = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  return (
    <PageWrapper>
      <Formik
        initialValues={{ ...initialState }}
        validationSchema={isRegistered ? loginValidation : registerValidation}
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
        {({ isSubmitting, errors, resetForm }) => (
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
              {isRegistered ? 'Bienvenido a MERN Chat App' : 'Registro de nuevo usuario'}
            </Typography>

            <AlertDisplay isSubmitting={isSubmitting} error={errors.general} />
            {!isRegistered && (
              <TextInput
                name='displayName'
                label='Nombre de usuario'
                autoComplete='off'
                margin='normal'
                disabled={isSubmitting}
              />
            )}
            <TextInput
              name='email'
              label='Email'
              autoComplete={isRegistered ? 'username' : 'off'}
              margin='normal'
              disabled={isSubmitting}
            />
            <TextInput
              name='password'
              label='Password'
              type='password'
              autoComplete={isRegistered ? 'current-password' : 'off'}
              margin='normal'
              disabled={isSubmitting}
            />
            {!isRegistered && (
              <TextInput
                name='confirmPassword'
                label='Confirmar password'
                type='password'
                autoComplete='off'
                margin='normal'
                disabled={isSubmitting}
              />
            )}
            <ButtonInput size='large' sx={{ mt: 2 }} disabled={isSubmitting}>
              {isRegistered ? 'Iniciar sesión' : 'Registrarse'}
            </ButtonInput>
            <ButtonInput
              disableRipple
              size='large'
              color={isRegistered ? 'success' : 'error'}
              type='button'
              sx={{ mt: 1 }}
              disabled={isSubmitting}
              onClick={() => {
                resetForm({ ...initialState });
                setIsRegistered(!isRegistered);
              }}
            >
              {isRegistered ? 'Crear nueva cuenta' : 'Cancelar'}
            </ButtonInput>
          </PaperWrapper>
        )}
      </Formik>
    </PageWrapper>
  );
};

export default Login;
