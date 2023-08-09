import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'linear-gradient(180deg, rgba(13,71,121,1) 0%, rgba(27,175,210,1) 100%)',
          backgroundColor: 'rgba(27,175,210,1)',
          minHeight: '500px',
          height: '100%',
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
