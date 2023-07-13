import { Button } from '@mui/material';
import { useFormikContext } from 'formik';

const ButtonInput = ({ children, ...otherProps }) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configButton = {
    variant: 'contained',
    ...otherProps,
    onClick: otherProps.type === 'button' ? otherProps.onClick : handleSubmit,
  };
  return <Button {...configButton}>{children}</Button>;
};

export default ButtonInput;
