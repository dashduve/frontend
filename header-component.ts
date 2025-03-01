import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';

// Iconos
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import InventoryIcon from '@mui/icons-material/Inventory';

// Hooks personalizados
import useAuth from '../../hooks/useAuth';
import useThemeContext from '../../hooks/useThemeContext';
import { useAlertsContext } from '../../hooks/useAlertsContext';

interface HeaderProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ drawerWidth, onDrawerToggle }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const { alertas, alertasCount } = useAlertsContext();
  
  // Estados para menús desplegables
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notifMenuAnchor, setNotifMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Manejadores para abrir/cerrar menús
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  const handleNotifMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotifMenuAnchor(event.currentTarget);
  };
  
  const handleNotifMenuClose = () => {
    setNotifMenuAnchor(null);
  };
  
  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="abrir menú"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" noWrap component="div">
            Inventario PWA
          </Typography>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Icono de tema (sol/luna) */}
        <Tooltip title={`Cambiar a modo ${mode === 'light' ? 'oscuro' : 'claro'}`}>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
        
        {/* Icono de notificaciones */}
        <Tooltip title="Notificaciones">
          <IconButton 
            color="inherit" 
            onClick={handleNotifMenuOpen}
            aria-controls="notifications-menu"
            aria-haspopup="true"
          >
            <Badge badgeContent={alertasCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        
        {/* Menú de notificaciones */}
        <Menu
          id="notifications-menu"
          anchorEl={notifMenuAnchor}
          keepMounted
          open={Boolean(notifMenuAnchor)}
          onClose={handleNotifMenuClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 300 }
          }}
        >
          <Typography sx={{ p: 2 }} variant="subtitle1">
            Alertas de Inventario
          </Typography>
          <Divider />
          
          {alertas.length === 0 ? (
            <MenuItem disabled>
              <Typography variant="body2">No hay alertas pendientes</Typography>
            </MenuItem>
          ) : (
            alertas.map((alerta) => (
              <MenuItem 
                key={alerta.id_alerta} 
                component={RouterLink} 
                to={`/productos/${alerta.id_producto}`}
                onClick={handleNotifMenuClose}
              >
                <Typography variant="body2" color="error">
                  Stock bajo: {alerta.nombre_producto} - Actual: {alerta.stock_actual}, Mínimo: {alerta.nivel_minimo}
                </Typography>
              </MenuItem>
            ))
          )}
        </Menu>
        
        {/* Avatar del usuario */}
        <Tooltip title="Perfil y ajustes">
          <IconButton
            onClick={handleUserMenuOpen}
            aria-controls="user-menu"
            aria-haspopup="true"
            color="inherit"
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {user?.nombre_completo ? user.nombre_completo.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </IconButton>
        </Tooltip>
        
        {/* Menú del usuario */}
        <Menu
          id="user-menu"
          anchorEl={userMenuAnchor}
          keepMounted
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: { width: 220 }
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" noWrap>
              {user?.nombre_completo}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
          
          <Divider />
          
          <MenuItem 
            component={RouterLink} 
            to="/settings/profile" 
            onClick={handleUserMenuClose}
          >
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Mi Perfil" />
          </MenuItem>
          
          <MenuItem 
            component={RouterLink} 
            to="/settings" 
            onClick={handleUserMenuClose}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Configuración" />
          </MenuItem>
          
          <MenuItem>
            <ListItemIcon>
              {mode === 'light' ? <Brightness4Icon fontSize="small" /> : <Brightness7Icon fontSize="small" />}
            </ListItemIcon>
            <ListItemText primary="Modo Oscuro" />
            <Switch 
              edge="end" 
              checked={mode === 'dark'} 
              onChange={toggleTheme} 
              size="small" 
            />
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
