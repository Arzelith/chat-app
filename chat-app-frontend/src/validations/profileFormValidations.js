import * as Yup from 'yup';
import { emailValidation } from './allVlidations';

export const profileValidation = Yup.object().shape({
  email: emailValidation(),
});
