import * as Yup from 'yup';
import isEmail from 'validator/lib/isEmail';

const passwordValidation = () => {
  return Yup.string().required('la contraseña es requerida');
};

const emailValidation = () => {
  return Yup.string()
  .required('el email es requerido')
  .test('is-valid', 'el email no es válido', (value) => isEmail(value))
};

const displayNameValidation = () => {
  return Yup.string()
    .required('el nombre de usuario es requerido')
    .min(3, 'el nombre de usuario debe tener entre 3 y 20 caracteres')
    .max(20, 'el nombre de usuario debe tener entre 3 y 20 caracteres');
};

const newPasswordValidation = () => {
  return Yup.string()
    .required('la contraseña es requerida')
    .min(6, 'la contraseña debe tener entre 6 y 20 caracteres')
    .max(20, 'la contraseña debe tener entre 6 y 20 caracteres');
};

const confirmPasswordValidation = () => {
  return Yup.string().oneOf([Yup.ref('password'), null], 'las contraseñas no concuerdan');
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
