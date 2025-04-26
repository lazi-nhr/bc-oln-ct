import '../styles/globals.css'
import { EthereumAddressProvider } from '../contexts/EthereumAddressContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
        },
      },
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EthereumAddressProvider>
        <Component {...pageProps} />
      </EthereumAddressProvider>
    </ThemeProvider>
  );
}
