import { useState } from 'react';
import { FormInput } from './';
import { Avatar, FormHelperText } from '@mui/material';
import { ErrorMessage } from 'formik';
import { convertToBase64 } from '../utils/imageToBase64Handler';

const AvatarForm = ({ isSubmitting, user, setFieldValue }) => {
  const [preview, setPreview] = useState(user.avatar);

  const handleImage = async (e, setfieldValue) => {
    const file = e.target.files[0];
    setfieldValue('avatar', file);
    const base64 = await convertToBase64(file);
    setPreview(base64);
    setfieldValue('avatar64', base64);
    return base64;
  };

  return (
    <>
      <Avatar
        src={preview}
        sx={{ height: 150, width: 150, ml: 'auto', mr: 'auto', mb: 1 }}
      />
      <FormInput
        type='file'
        name='avatarFile'
        accept='.png, .jpg, .jpeg, .gif'
        onChange={(e) => {
          handleImage(e, setFieldValue);
        }}
        disabled={isSubmitting}
      />
      <FormHelperText error={true} variant='outlined'>
        <ErrorMessage name={'avatar'} />{' '}
      </FormHelperText>
    </>
  );
};

export default AvatarForm;
