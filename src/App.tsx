import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css'
import { Dashboard } from './pages/dashboard/dashboard'
import { Login } from './pages/login/login';

const authStorageKey = 'logitrack-authenticated';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
    },
    secondary: {
      main: '#ff8f00',
    },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem(authStorageKey) === 'true');

  const handleLogin = () => {
    localStorage.setItem(authStorageKey, 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(authStorageKey);
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </ThemeProvider>
  )
}

export default App
