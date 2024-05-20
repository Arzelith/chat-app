import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import img from './assets/images/bg.jpg'
const theme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {

          background: '#fff',
          borderRadius: '6px',
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: 'gray',
          },
          '&:hover .MuiOutlinedInput-root:not(.Mui-error):not(.Mui-focused) .MuiOutlinedInput-notchedOutline':
            {
              borderColor: 'gray',
            },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${img})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundColor: 'rgba(27,175,210,1)',
          minHeight: '500px',
          height: '100%',

          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: '10px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            backgroundColor: '#61abf6',
            borderColor: '#fff',
            minHeight: 24,
            borderRadius: '10px',
          },
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
