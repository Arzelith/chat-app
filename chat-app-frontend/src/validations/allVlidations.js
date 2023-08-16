import * as Yup from 'yup';
import isEmail from 'validator/lib/isEmail';

const passwordValidation = () => {
  return Yup.string().required('password es requerido');
};

const emailValidation = () => {
  return Yup.string()
  .required('email es requerido')
  .test('is-valid', 'email no es válido', (value) => isEmail(value))
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

const MAX_FILE_SIZE = 10240000;
const validFileExtensions = { image: ['jpg', 'gif', 'png', 'jpeg'] };
function isValidFileType(fileName, fileType) {
  return (
    fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
  );
}

const imageValidation = () => {
  return Yup.mixed()
    .required('debe seleccionar un archivo')
    .test('is-valid-type', 'el formato no es válido: jpg, jpeg, gif, png', (value) =>
      isValidFileType(value && value.name.toLowerCase(), 'image')
    )
    .test(
      'is-valid-size',
      'el tamaño máximo permitido son 10MB',
      (value) => value && value.size <= MAX_FILE_SIZE
    );
};

export {
  passwordValidation,
  emailValidation,
  displayNameValidation,
  newPasswordValidation,
  confirmPasswordValidation,
  imageValidation,
};
