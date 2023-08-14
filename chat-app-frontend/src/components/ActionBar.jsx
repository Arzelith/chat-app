import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { logoutUser, updateUserAvatar, updateUserStatus } from '../features/userSlice';
import { exitCurrentChat } from '../features/chatSlice';
import { setServerError } from '../features/serverErrorSlice';
import { UserAvatar, CustomBadge, DropDownMenu } from './';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  MoreVert,
  ExpandLess,
  ExpandMore,
  AddComment,
  ArrowBack,
} from '@mui/icons-material';

const ActionBar = ({
  variant,
  setOpenFormModal,
  setOpenUserFinderModal,
  user,
  disconnect,
  socket,
  chatList,
}) => {
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
            updateUserAvatar({
              axiosPrivate,
              values: { action: 'remove', socket, chatList },
            })
          ).unwrap();
        } catch (error) {
          dispatch(setServerError(error));
        }
      },
    },
  ];

  const setStatus = async (status) => {
    try {
      await dispatch(
        updateUserStatus({ axiosPrivate, values: { status, socket, chatList } })
      ).unwrap();
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
    { text: 'Actualizar email', action: () => setOpenFormModal('email') },
    { text: 'Actualizar contraseña', action: () => setOpenFormModal('password') },
    {
      text: 'Cerrar sesión',
      action: () => {
        dispatch(logoutUser());
        disconnect();
      },
    },
  ];

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
                sx={{ cursor: 'pointer' }}
              >
                <CustomBadge
                  top={34}
                  height={'12px'}
                  width={'12px'}
                  user={user}
                  overlap='circular'
                  variant='dot'
                >
                  <UserAvatar
                    avatar={user.avatar}
                    height={'43px'}
                    width={'43px'}
                    displayName={user.displayName}
                  ></UserAvatar>
                </CustomBadge>
              </Box>

              <DropDownMenu
                anchorEl={anchorEl}
                open={open === 'avatar'}
                handleCloseMenu={handleCloseMenu}
                arr={avatarMenuItems}
              />
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

            <DropDownMenu
              anchorEl={anchorEl}
              open={open === 'status'}
              handleCloseMenu={handleCloseMenu}
              arr={statusMenuItems}
            />

            <IconButton color='inherit' onClick={() => setOpenUserFinderModal(true)}>
              <AddComment />
            </IconButton>

            <IconButton
              color='inherit'
              onClick={(e) => {
                handleOpenMenu(e, 'vertical');
              }}
            >
              <MoreVert />
            </IconButton>

            <DropDownMenu
              anchorEl={anchorEl}
              open={open === 'vertical'}
              handleCloseMenu={handleCloseMenu}
              arr={verticalMenuItems}
            />
          </>
        )}
        {variant === 'right' && (
          <>
            <UserAvatar
              avatar={user.avatar}
              height={'43px'}
              width={'43px'}
              displayName={user.displayName}
            ></UserAvatar>
            <Typography variant='h6' ml={1} flexGrow={1}>
              {user.displayName}
            </Typography>
            <IconButton
              color='inherit'
              onClick={() => {
                dispatch(exitCurrentChat());
              }}
            >
              <ArrowBack fontSize={'medium'} />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ActionBar;
