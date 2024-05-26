import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import img from './assets/images/bg1.jpg';
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
          background: 'rgb(171,225,251)',
          background:
            'linear-gradient(180deg, rgba(171,225,251,1) 0%, rgba(248,252,255,1) 100%)',
          backgroundImage: `url(${img})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
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
