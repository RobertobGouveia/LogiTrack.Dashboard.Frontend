import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css'
import { Dashboard } from './pages/dashboard/dashboard'
import { Login } from './pages/login/login';
import { ManutencoesPage } from './pages/manutencoes/manutencoes';
import { VeiculosPage } from './pages/veiculos/veiculos';
import { ViagensPage } from './pages/viagens/viagens';

const authStorageKey = 'logitrack-authenticated';
type AppPage = 'dashboard' | 'manutencoes' | 'veiculos' | 'viagens';

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
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

  const handleLogin = () => {
    localStorage.setItem(authStorageKey, 'true');
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(authStorageKey);
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated ? (
        currentPage === 'dashboard' ? (
          <Dashboard onLogout={handleLogout} onNavigate={setCurrentPage} />
        ) : currentPage === 'veiculos' ? (
          <VeiculosPage onLogout={handleLogout} onNavigate={setCurrentPage} />
        ) : currentPage === 'viagens' ? (
          <ViagensPage onLogout={handleLogout} onNavigate={setCurrentPage} />
        ) : (
          <ManutencoesPage onLogout={handleLogout} onNavigate={setCurrentPage} />
        )
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </ThemeProvider>
  )
}

export default App
