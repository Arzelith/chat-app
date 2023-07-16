import { useState } from 'react';
import { axiosPublic } from '../api/axios';
import handleServerError from '../utils/serverErrorHandler';
import {
  TextInput,
  PageWrapper,
  AlertDisplay,
  PaperWrapper,
  ActionModal,
} from '../components';
import { Formik, Form } from 'formik';
import { loginValidation, registerValidation } from '../validations/loginPageValidations';
import { Typography, Button } from '@mui/material';
import Lottie from 'lottie-react';
import logo from '../assets/animations/logoA.json';

const initialState = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Login = () => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [open, setOpen] = useState(true);

  return (
    <PageWrapper>
      <ActionModal
        variant={'success'}
        open={open}
        title={'Registro exitoso'}
        acceptBtnText={'Aceptar'}
        onClick={() => {
          setOpen(false);
          setIsRegistered(true);
        }}
      />
      <Formik
        initialValues={{ ...initialState }}
        validationSchema={isRegistered ? loginValidation : registerValidation}
        onSubmit={async (values, actions) => {
          try {
            if (!isRegistered) {
              await axiosPublic.post('/users', values);
              setOpen(true);
            } else {
              console.log(values);
            }
            actions.resetForm({ ...initialState });
          } catch (error) {
            if (!isRegistered) {
              const requestError = handleServerError(error);
              actions.setFieldError('general', requestError.message);
            }
          } finally {
            actions.setSubmitting(false);
          }
        }}
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
            <Button
              size='large'
              sx={{ mt: 2 }}
              disabled={isSubmitting}
              type='submit'
              variant='contained'
            >
              {isRegistered ? 'Iniciar sesión' : 'Registrarse'}
            </Button>
            <Button
              disableRipple
              size='large'
              color={isRegistered ? 'success' : 'error'}
              type='button'
              sx={{ mt: 1 }}
              disabled={isSubmitting}
              variant='contained'
              onClick={() => {
                resetForm({ ...initialState });
                setIsRegistered(!isRegistered);
              }}
            >
              {isRegistered ? 'Crear nueva cuenta' : 'Cancelar'}
            </Button>
          </PaperWrapper>
        )}
      </Formik>
    </PageWrapper>
  );
};

export default Login;
