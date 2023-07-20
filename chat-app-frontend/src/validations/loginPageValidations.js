import * as Yup from 'yup';
import {
  passwordValidation,
  emailValidation,
  displayNameValidation,
  newPasswordValidation,
  confirmPasswordValidation,
} from './allVlidations';

export const loginValidation = Yup.object().shape({
  password: passwordValidation(),
  email: emailValidation(),
});

export const registerValidation = Yup.object().shape({
  displayName: displayNameValidation(),
  email: emailValidation(),
  password: newPasswordValidation(),
  confirmPassword: confirmPasswordValidation(),
});
