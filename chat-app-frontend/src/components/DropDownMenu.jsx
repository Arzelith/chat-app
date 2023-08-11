import { Menu, MenuItem, Typography } from '@mui/material';

const DropDownMenu = ({anchorEl, open, handleCloseMenu, arr}) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
      {arr.map((menuItem) => (
        <MenuItem
          key={menuItem.text}
          onClick={() => {
            handleCloseMenu();
            menuItem.action();
          }}
        >
          <Typography variant='body2'>{menuItem.text}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default DropDownMenu;
