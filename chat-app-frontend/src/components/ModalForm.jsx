import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionModal, AlertDisplay, AvatarForm, FormInput, FormBtnCombo } from '.';
import { profileValidation } from '../validations/profileFormValidations';
import { passwordValidation } from '../validations/passwordFormValidations';
import { avatarValidation } from '../validations/avatarFormValidation';
import { Formik, Form } from 'formik';
import { Box } from '@mui/material';

const inputs = [
  { name: 'displayName', label: 'Nombre de usuario', formType: 'perfil' },
  { name: 'email', label: 'Email', formType: 'perfil' },
  { name: 'password', label: 'Password', type: 'password', formType: 'password' },
  {
    name: 'confirmPassword',
    label: 'Confirmar password',
    type: 'password',
    formType: 'password',
  },
];

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
            {inputs
              .filter((input) => input.formType === openFormModal)
              .map((input) => (
                <FormInput
                  key={input.name}
                  name={input.name}
                  label={input.label}
                  autoComplete='off'
                  margin='normal'
                  disabled={isSubmitting}
                />
              ))}

            {openFormModal === 'avatar' && (
              <AvatarForm
                isSubmitting={isSubmitting}
                user={user}
                setFieldValue={setFieldValue}
              />
            )}
            <FormBtnCombo
              isSubmitting={isSubmitting}
              submitBtnText={'Enviar'}
              cancelBtnText={'Cancelar'}
              cancelBtnColor={'error'}
              cancelAction={() => {
                setOpenFormModal('');
              }}
            />
          </Box>
        )}
      </Formik>
    </>
  );
};

export default ModalForm;
