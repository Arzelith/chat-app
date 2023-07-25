import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/userSlice';
import { UserAvatar } from './';
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
import { MoreVert, ExpandLess, ExpandMore, AddComment } from '@mui/icons-material';

const ActionBar = ({ variant, setOpenFormModal, setOpenUserFinderModal, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState('');
  const dispatch = useDispatch();

  const handleOpenMenu = (e, menu) => {
    setAnchorEl(e.currentTarget);
    setOpen(menu);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpen('');
  };

  const avatarMenuItems = [
    { text: 'Cambiar avatar', action: () => setOpenFormModal('avatar') },
    { text: 'Eliminar avatar', action: () => console.log('Eliminar avatar') },
  ];

  const statusMenuItems = [
    { text: 'Disponible', action: () => console.log('disponible') },
    { text: 'No disponible', action: () => console.log('No disponible') },
    { text: 'Ocupado', action: () => console.log('Ocupado') },
  ];

  const verticalMenuItems = [
    { text: 'Configurar perfil', action: () => setOpenFormModal('perfil') },
    { text: 'Cambiar contraseña', action: () => setOpenFormModal('password') },
    { text: 'Cerrar sesión', action: () => dispatch(logoutUser()) },
  ];

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 4,
      top: 32,
      border: `1px solid ${theme.palette.background.paper}`,
      borderRadius: '50%',
      height: '14px',
      width: '14px',
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
                  handleOpenMenu(e, 'avatar');
                }}
              >
                <StyledBadge color='success' variant='dot'>
                  <UserAvatar
                    avatar={user.avatar}
                    height={'43px'}
                    width={'43px'}
                    displayName={user.displayName}
                  ></UserAvatar>
                </StyledBadge>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={open === 'avatar'}
                onClose={handleCloseMenu}
              >
                {avatarMenuItems.map((menuItem) => (
                  <MenuItem
                    key={menuItem.text}
                    onClick={() => {
                      handleCloseMenu();
                      menuItem.action();
                    }}
                  >
                    {menuItem.text}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box flexGrow={1}>
              <Box
                display={'flex'}
                width={50}
                sx={{ cursor: 'pointer' }}
                onClick={(e) => {
                  handleOpenMenu(e, 'status');
                }}
              >
                <Typography ml={1} fontSize={15}>
                  Disponible
                </Typography>

                {open === 'status' ? (
                  <ExpandLess sx={{ height: '22px' }} />
                ) : (
                  <ExpandMore sx={{ height: '22px' }} />
                )}
              </Box>
            </Box>

            <Menu anchorEl={anchorEl} open={open === 'status'} onClose={handleCloseMenu}>
              {statusMenuItems.map((menuItem) => (
                <MenuItem
                  key={menuItem.text}
                  onClick={() => {
                    menuItem.action();
                    handleCloseMenu();
                  }}
                >
                  {menuItem.text}
                </MenuItem>
              ))}
            </Menu>

            <IconButton
              color='inherit'
              size='large'
              onClick={() => setOpenUserFinderModal(true)}
            >
              <AddComment />
            </IconButton>

            <IconButton
              size='large'
              color='inherit'
              onClick={(e) => {
                handleOpenMenu(e, 'vertical');
              }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open === 'vertical'}
              onClose={handleCloseMenu}
            >
              {verticalMenuItems.map((menuItem) => (
                <MenuItem
                  key={menuItem.text}
                  onClick={() => {
                    handleCloseMenu();
                    menuItem.action();
                  }}
                >
                  {menuItem.text}
                </MenuItem>
              ))}
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
