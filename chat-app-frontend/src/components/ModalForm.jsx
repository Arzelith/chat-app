import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserEmail, updateUserAvatar } from '../features/userSlice';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import handleServerError from '../utils/serverErrorHandler';
import { setServerError } from '../features/serverErrorSlice';
import { ActionModal, AlertDisplay, AvatarForm, FormInput, FormBtnCombo } from '.';
import { profileValidation } from '../validations/profileFormValidations';
import { passwordValidation } from '../validations/passwordFormValidations';
import { avatarValidation } from '../validations/avatarFormValidation';
import { Formik, Form } from 'formik';
import { Box } from '@mui/material';

const inputs = [
  { name: 'email', label: 'Email', formType: 'email' },
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
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();

  const initialValues = () => {
    if (openFormModal === 'email') {
      return {  email: user.email };
    }
    if (openFormModal === 'password') {
      return { password: '', confirmPassword: '' };
    }
    if (openFormModal === 'avatar') {
      return { avatar64: '', avatar: undefined };
    }
  };

  return (
    <ActionModal
      title={`Actualiza tu ${openFormModal}`}
      open={openFormModal.length > 0}
      variant={'form'}
    >
      <ActionModal
        title={`${
          openFormModal ? openFormModal[0].toUpperCase() + openFormModal.slice(1) : ''
        } actualizado`}
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
          openFormModal === 'email'
            ? profileValidation
            : openFormModal === 'password'
            ? passwordValidation
            : avatarValidation
        }
        onSubmit={async (values, actions) => {
          try {
            if (openFormModal === 'email') {
              await dispatch(updateUserEmail({ axiosPrivate, values })).unwrap();
            }
            if (openFormModal === 'password') {
              await axiosPrivate.patch('/users/current-user/password', values);
            }
            if (openFormModal === 'avatar') {
              delete values.avatar;
              values.action = 'replace';
              await dispatch(updateUserAvatar({ axiosPrivate, values })).unwrap();
            }
            setOpenSuccessModal(true);
          } catch (error) {
            if (error.status !== 401 && error.status !== 403 && error.status < 500) {
              if (openFormModal !== 'password') {
                actions.setFieldError('general', error.message);
              } else {
                const serverError = handleServerError(error);
                actions.setFieldError('general', serverError.message);
              }
            } else {
              if (openFormModal !== 'password') {
                dispatch(setServerError(error));
              } else {
                const serverError = handleServerError(error);
                dispatch(setServerError(serverError));
              }
            }
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
    </ActionModal>
  );
};

export default ModalForm;
