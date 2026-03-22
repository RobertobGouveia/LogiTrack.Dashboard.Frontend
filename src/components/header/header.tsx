import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

type AppPage = 'dashboard' | 'manutencoes' | 'veiculos' | 'viagens';

const pages = [
  { label: 'Dashboard', key: 'dashboard' as const },
  { label: 'Veiculos', key: 'veiculos' as const },
  { label: 'Viagens', key: 'viagens' as const },
  { label: 'Manutenções', key: 'manutencoes' as const },
];

type ResponsiveAppBarProps = {
  onLogout?: () => void;
  onNavigate?: (page: AppPage) => void;
  activePage?: AppPage;
};

function ResponsiveAppBar({ onLogout, onNavigate, activePage = 'dashboard' }: ResponsiveAppBarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = React.useState(false);

  const handleNavigate = (page?: AppPage) => {
    handleCloseNavMenu();
    if (page && onNavigate) {
      onNavigate(page);
    }
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const openLogoutDialog = () => {
    setConfirmLogoutOpen(true);
  };

  const closeLogoutDialog = () => {
    setConfirmLogoutOpen(false);
  };

  const confirmLogout = () => {
    onLogout?.();
    setConfirmLogoutOpen(false);
  };

  return (
    <>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(255,255,255,0.45)',
          bgcolor: 'rgba(12, 28, 52, 0.84)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LogiTrack
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={() => handleNavigate(page.key)} disabled={!page.key}>
                  <Typography sx={{ textAlign: 'center' }}>{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LogiTrack
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={() => handleNavigate(page.key)}
                disabled={!page.key}
                variant={page.key && page.key === activePage ? 'outlined' : 'text'}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  borderColor: 'rgba(255,255,255,0.5)',
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

            {onLogout ? (
              <Button
                color="inherit"
                onClick={openLogoutDialog}
                startIcon={<LogoutRoundedIcon />}
                sx={{
                  borderRadius: 999,
                  px: 2,
                  bgcolor: 'rgba(255,255,255,0.08)',
                }}
              >
                Sair
              </Button>
            ) : null}
          </Toolbar>
        </Container>
      </AppBar>

      <Dialog open={confirmLogoutOpen} onClose={closeLogoutDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar saída</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja sair?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmLogout}>Sair</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default ResponsiveAppBar;
