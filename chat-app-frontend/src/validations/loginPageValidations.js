import * as Yup from 'yup';

export const loginValidation = Yup.object().shape({
  password: Yup.string().required('password es requerido'),
  email: Yup.string().email('email inválido').required('email es requerido'),
});

export const registerValidation = Yup.object().shape({
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