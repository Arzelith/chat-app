import { FormInput } from './';

const PasswordForm = ({ isSubmitting }) => {
  return (
    <>
      <FormInput
        name='password'
        label='Password'
        type='password'
        autoComplete='off'
        margin='normal'
        disabled={isSubmitting}
      />

      <FormInput
        name='confirmPassword'
        label='Confirmar password'
        type='password'
        autoComplete='off'
        margin='normal'
        disabled={isSubmitting}
      />
    </>
  );
};

export default PasswordForm;
