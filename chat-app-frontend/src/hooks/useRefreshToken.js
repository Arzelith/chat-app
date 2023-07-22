import { useDispatch } from 'react-redux';
import { axiosPublic } from '../api/axios';
import { setAccessToken } from '../features/userSlice';

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const refresh = async () => {
    const response = await axiosPublic.get('/refresh');
    dispatch(setAccessToken(response.data.accessToken));
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
