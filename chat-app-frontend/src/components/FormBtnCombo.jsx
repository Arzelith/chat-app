import { Button } from '@mui/material';

const FormBtnCombo = ({
  isSubmitting,
  submitBtnText,
  cancelBtnColor,
  cancelAction,
  cancelBtnText,
  ...otherProps
}) => {
  return (
    <>
      <Button
        size='large'
        sx={{ mt: 2 }}
        disabled={isSubmitting}
        type='submit'
        variant='contained'
      >
        {submitBtnText}
      </Button>
      <Button
        {...otherProps}
        size='large'
        color={cancelBtnColor}
        type='button'
        sx={{ mt: 1 }}
        disabled={isSubmitting}
        variant='contained'
        onClick={cancelAction}
      >
        {cancelBtnText}
      </Button>
    </>
  );
};

export default FormBtnCombo;
