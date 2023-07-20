import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionModal, AlertDisplay, ProfileForm, PasswordForm, AvatarForm } from '.';
import { profileValidation } from '../validations/profileFormValidations';
import { passwordValidation } from '../validations/passwordFormValidations';
import { avatarValidation } from '../validations/avatarFormValidation';
import { Formik, Form } from 'formik';
import { Button, Box } from '@mui/material';

const ModalForm = ({ setOpenFormModal, openFormModal }) => {
  const { user } = useSelector((storage) => storage.user);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const initialValues = () => {
    if (openFormModal === 'perfil') {
      return { displayName: user.displayName, email: user.email };
    }
    if (openFormModal === 'password') {
      return { password: '', confirmPassword: '' };
    }
    if (openFormModal === 'avatar') {
      return { avatar64: '', avatar: undefined };
    }
  };

  return (
    <>
      <ActionModal
        title={`${openFormModal[0].toUpperCase() + openFormModal.slice(1)} actualizado`}
        variant={'success'}
        open={openSuccessModal}
        acceptBtnText={'Aceptar'}
        onClick={() => {
          setOpenFormModal('');
          setOpenSuccessModal(false);
        }}
      />
      <Formik
        initialValues={initialValues()}
        validationSchema={
          openFormModal === 'perfil'
            ? profileValidation
            : openFormModal === 'password'
            ? passwordValidation
            : avatarValidation
        }
        onSubmit={(values, actions) => {
          try {
            if (openFormModal === 'perfil') {
              console.log('dispatch redux action profile');
            }
            if (openFormModal === 'password') {
              console.log('dispatch redux action password');
            }
            if (openFormModal === 'avatar') {
              console.log('dispatch redux action avatar');
              delete values.avatar;
            }
            setOpenSuccessModal(true);
            console.log(values);
          } catch (error) {
            actions.setFieldError('general', error.message);
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, setFieldValue }) => (
          <Box
            component={Form}
            display={!openSuccessModal ? 'flex' : 'none'}
            flexDirection={'column'}
          >
            <AlertDisplay isSubmitting={isSubmitting} error={errors.general} />
            {openFormModal === 'perfil' && <ProfileForm isSubmitting={isSubmitting} />}
            {openFormModal === 'password' && <PasswordForm isSubmitting={isSubmitting} />}
            {openFormModal === 'avatar' && (
              <AvatarForm
                isSubmitting={isSubmitting}
                user={user}
                setFieldValue={setFieldValue}
              />
            )}

            <Button
              size='large'
              sx={{ mt: 2 }}
              disabled={isSubmitting}
              type='submit'
              variant='contained'
            >
              Enviar
            </Button>
            <Button
              size='large'
              color='error'
              type='button'
              sx={{ mt: 1 }}
              disabled={isSubmitting}
              variant='contained'
              onClick={() => {
                setOpenFormModal('');
              }}
            >
              Cancelar
            </Button>
          </Box>
        )}
      </Formik>
    </>
  );
};

export default ModalForm;
