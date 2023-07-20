import * as Yup from 'yup';
import { newPasswordValidation, confirmPasswordValidation } from './allVlidations';

export const passwordValidation = Yup.object().shape({
  password: newPasswordValidation(),
  confirmPassword: confirmPasswordValidation(),
});
