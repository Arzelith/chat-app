import { useState } from 'react';

import {
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Typography,
  Box,
  MenuItem,
  Button,
  Badge,
  Menu,
  styled,
} from '@mui/material';
import { MoreVert, ExpandLess, ExpandMore } from '@mui/icons-material';

const ActionBar = ({ variant, setOpenFormModal }) => {
  const [avatarMenu, setAvatarMenu] = useState(null);
  const [vertMenu, setVertMenu] = useState(null);
  const [statusMenu, setStatusMenu] = useState(null);
  const openVertMenu = Boolean(vertMenu);
  const openAvatarMenu = Boolean(avatarMenu);
  const openStatusMenu = Boolean(statusMenu);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 5,
      top: 35,
      border: `1px solid ${theme.palette.background.paper}`,
      borderRadius: '50%',
      height: '16px',
      width: '16px',
    },
  }));

  return (
    <AppBar position='static'>
      <Toolbar>
        {variant === 'left' && (
          <>
            <Box>
              <Box
                id='avatar-button'
                onClick={(e) => {
                  setAvatarMenu(e.currentTarget);
                }}
              >
                <StyledBadge color='success' variant='dot'>
                  <Avatar sx={{ height: '45px', width: '45px', cursor: 'pointer' }} />
                </StyledBadge>
              </Box>

              <Menu
                id='avatar-menu-button'
                anchorEl={avatarMenu}
                open={openAvatarMenu}
                onClose={() => setAvatarMenu(null)}
                MenuListProps={{
                  'aria-labelledby': 'avatar-button',
                }}
              >
                <MenuItem
                  onClick={() => {
                    setAvatarMenu(null);
                    setOpenFormModal('avatar');
                  }}
                >
                  Cambiar avatar
                </MenuItem>
                <MenuItem onClick={() => setAvatarMenu(null)}>Eliminar avatar</MenuItem>
              </Menu>
            </Box>

            <Box
              display={'flex'}
              flexGrow={1}
              sx={{ cursor: 'pointer' }}
              onClick={(e) => {
                setStatusMenu(e.currentTarget);
              }}
              id='status-button'
            >
              <Typography ml={1} fontSize={15}>
                Disponible
              </Typography>

              {statusMenu ? (
                <ExpandLess sx={{ height: '22px' }} />
              ) : (
                <ExpandMore sx={{ height: '22px' }} />
              )}
            </Box>
            <Menu
              id='status-menu-button'
              anchorEl={statusMenu}
              open={openStatusMenu}
              onClose={() => setStatusMenu(null)}
              MenuListProps={{
                'aria-labelledby': 'status-button',
              }}
            >
              <MenuItem onClick={() => setStatusMenu(null)}>Disponible</MenuItem>
              <MenuItem onClick={() => setStatusMenu(null)}>No disponible</MenuItem>
              <MenuItem onClick={() => setStatusMenu(null)}>Ocupado</MenuItem>
            </Menu>

            <IconButton
              size='large'
              color='inherit'
              id='vert-button'
              onClick={(e) => {
                setVertMenu(e.currentTarget);
              }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id='vert-menu'
              anchorEl={vertMenu}
              open={openVertMenu}
              onClose={() => setVertMenu(null)}
              MenuListProps={{
                'aria-labelledby': 'vert-button',
              }}
            >
              <MenuItem
                onClick={() => {
                  setVertMenu(null);
                  setOpenFormModal('perfil');
                }}
              >
                Configurar perfil
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setVertMenu(null);
                  setOpenFormModal('password');
                }}
              >
                Cambiar contraseña
              </MenuItem>
              <MenuItem onClick={() => setVertMenu(null)}>Cerrar sesión</MenuItem>
            </Menu>
          </>
        )}
        {variant === 'right' && (
          <>
            <StyledBadge variant='dot' color='success'>
              <Avatar sx={{ height: '45px', width: '45px' }} />
            </StyledBadge>
            <Typography variant='h6' ml={1} flexGrow={1}>
              Javier
            </Typography>
            <Button size='large' color='info' variant='contained'>
              cerrar chat
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ActionBar;
