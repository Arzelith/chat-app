import * as Yup from 'yup';
import { imageValidation } from './allVlidations';

export const avatarValidation = Yup.object().shape({
  avatar: imageValidation(),
});
