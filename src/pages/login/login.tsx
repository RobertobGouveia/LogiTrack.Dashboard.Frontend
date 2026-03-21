import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

type LoginProps = {
  onLogin: () => void;
};

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha para continuar.');
      return;
    }

    setError('');
    onLogin();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(circle at top, rgba(25, 118, 210, 0.14), transparent 28%), linear-gradient(160deg, #f5f7fb 0%, #edf3ff 48%, #dfe9fb 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(380px, 440px)' },
            gap: { xs: 3, md: 6 },
            alignItems: 'center',
          }}
        >
          <Box sx={{ pr: { md: 2 }, maxWidth: 560 }}>
            <Stack spacing={2.5}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  boxShadow: '0 12px 32px rgba(25, 118, 210, 0.28)',
                }}
              >
                <LocalShippingRoundedIcon />
              </Avatar>
              <Box>
                <Typography variant="overline" color="primary.main" fontWeight={700}>
                  LogiTrack Platform
                </Typography>
                <Typography variant="h2" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, fontWeight: 800, lineHeight: 1.05 }}>
                  Gestão logística com leitura imediata do que importa.
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
                Entre para acompanhar indicadores, uso da frota e próximas manutenções em uma interface mais clara e operacional.
              </Typography>
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              width: '100%',
              borderRadius: 5,
              bgcolor: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 30px 80px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <Box>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  Entrar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use suas credenciais para acessar o painel.
                </Typography>
              </Box>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                autoComplete="email"
                placeholder="operacao@logitrack.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Senha"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                autoComplete="current-password"
                placeholder="Digite sua senha"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button type="submit" variant="contained" size="large" sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}>
                Acessar dashboard
              </Button>

              <Typography variant="caption" color="text.secondary" textAlign="center">
                Fluxo demonstrativo: qualquer e-mail e senha preenchidos liberam o acesso.
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}