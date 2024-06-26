import { Badge, styled } from '@mui/material';

const CustomBadge = ({ user, top, height, width, children, ...otherProps }) => {
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      top: top,
      border: `1px solid ${theme.palette.background.paper}`,
      borderRadius: '50%',
      height: height,
      width: width,
      backgroundColor:
        user.status === '1' && user.isOnline === '1'
          ? '#29bf60'
          : user.status === '2' && user.isOnline === '1'
          ? 'yellow'
          : user.status === '3' && user.isOnline === '1'
          ? 'red'
          : '#dbe1ea',
    },
  }));
  return <StyledBadge {...otherProps}>{children}</StyledBadge>;
};

export default CustomBadge;
