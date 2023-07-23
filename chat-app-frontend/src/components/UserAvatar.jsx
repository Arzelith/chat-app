import { Avatar } from '@mui/material';

const UserAvatar = ({ displayName, height, width, avatar, ...otherProps }) => {
  const stringToColor = () => {
    let hash = 0;
    let i;

    for (i = 0; i < displayName.length; i += 1) {
      hash = displayName.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };
  return (
    <Avatar
      src={avatar}
      sx={{ height: height, width: width, cursor: 'pointer', bgcolor: stringToColor() }}
      {...otherProps}
    >
      {!avatar && displayName[0].toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
