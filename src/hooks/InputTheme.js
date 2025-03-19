import { createTheme } from '@mui/material/styles';

// Define the light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f7f9fb',
      paper: '#fff',
    },
  },
  
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
    background: {
      default: '#2e2d32',
      paper: '#121212',
    },
    exportButton: {
      main: '#ffffff', 
    },
  },
});

// Export the themes
export { lightTheme, darkTheme };
