import { FormInput } from './';

const ProfileForm = ({ isSubmitting }) => {
  return (
    <>
      <FormInput
        name='displayName'
        label='Nombre de usuario'
        autoComplete='off'
        margin='normal'
        disabled={isSubmitting}
      />

      <FormInput
        name='email'
        label='Email'
        autoComplete='off'
        margin='normal'
        disabled={isSubmitting}
      />
    </>
  );
};

export default ProfileForm;
