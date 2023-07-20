import * as Yup from 'yup';

const passwordValidation = () => {
  return Yup.string().required('password es requerido');
};

const emailValidation = () => {
  return Yup.string().email('email inválido').required('email es requerido');
};

const displayNameValidation = () => {
  return Yup.string()
    .required('nombre de usuario es requerido')
    .min(3, 'nombre de usuario debe tener entre 3 y 20 caracteres')
    .max(20, 'nombre de usuario debe tener entre 3 y 20 caracteres');
};

const newPasswordValidation = () => {
  return Yup.string()
    .required('password es requerido')
    .min(6, 'password debe tener entre 6 y 20 caracteres')
    .max(20, 'password debe tener entre 6 y 20 caracteres');
};

const confirmPasswordValidation = () => {
  return Yup.string().oneOf([Yup.ref('password'), null], 'passwords no concuerdan');
};

export {
  passwordValidation,
  emailValidation,
  displayNameValidation,
  newPasswordValidation,
  confirmPasswordValidation,
};
