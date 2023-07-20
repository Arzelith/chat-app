import * as Yup from 'yup';
import { displayNameValidation, emailValidation } from './allVlidations';

export const profileValidation = Yup.object().shape({
  displayName: displayNameValidation(),
  email: emailValidation(),
});
