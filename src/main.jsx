import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './components/ui/toast'
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from './hooks/InputTheme';
import { useTheme } from 'next-themes'
import { SocketProvider } from './context/SocketContext'
const AppWithTheme = () => {
  const { theme } = useTheme();
  const appliedTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <MUIThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <App />
    </MUIThemeProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider attribute="class">
      <AuthProvider>
        <SocketProvider>
        <ToastProvider>
          <AppWithTheme />
        </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
