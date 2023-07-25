import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { logoutUser, updateUserAvatar, updateUserStatus } from '../features/userSlice';
import { setServerError } from '../features/serverErrorSlice';
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
  const axiosPrivate = useAxiosPrivate();
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
    {
      text: 'Eliminar avatar',
      action: async () => {
        try {
          await dispatch(
            updateUserAvatar({ axiosPrivate, values: { action: 'remove' } })
          ).unwrap();
        } catch (error) {
          dispatch(setServerError(error));
        }
      },
    },
  ];

  const setStatus = async (status) => {
    try {
      await dispatch(updateUserStatus({ axiosPrivate, values: { status } })).unwrap();
    } catch (error) {
      dispatch(setServerError(error));
    }
  };

  const statusMenuItems = [
    { text: 'Disponible', action: () => setStatus('1') },
    { text: 'Asusente', action: () => setStatus('2') },
    { text: 'No disponible', action: () => setStatus('3') },
  ];

  const verticalMenuItems = [
    { text: 'Configurar perfil', action: () => setOpenFormModal('perfil') },
    { text: 'Cambiar contraseña', action: () => setOpenFormModal('password') },
    {
      text: 'Cerrar sesión',
      action: () => {
        dispatch(logoutUser());
      },
    },
  ];

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      top: 34,
      border: `1px solid ${theme.palette.background.paper}`,
      borderRadius: '50%',
      height: '12px',
      width: '12px',
      backgroundColor:
        user.status === '1'
          ? 'green'
          : user.status === '2'
          ? 'yellow'
          : user.status === '3'
          ? 'red'
          : '#dbe1ea',
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
                <StyledBadge overlap='circular' variant='dot'>
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
                width={'fit-content'}
                sx={{ cursor: 'pointer' }}
                onClick={(e) => {
                  handleOpenMenu(e, 'status');
                }}
              >
                <Typography ml={1} fontSize={15}>
                  {user.status === '1'
                    ? 'Disponible'
                    : user.status === '2'
                    ? 'Ausente'
                    : user.status === '3'
                    ? 'No disponible'
                    : 'Desconectado'}
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
