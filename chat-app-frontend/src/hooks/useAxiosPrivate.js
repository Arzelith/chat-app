import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { logoutUser } from '../features/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {
  const { accessToken } = useSelector((storage) => storage.user);
  const refresh = useRefreshToken();
  const dispatch = useDispatch();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (!prevRequest?.sent) {
          prevRequest.sent = true;
          if (error?.response?.status === 403) {
            const newAccessToken = await refresh();
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          }
          if (error?.response?.status === 401) {
            //PENDIENTE LOGOUT-MODAL
            dispatch(logoutUser());
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.request.eject(responseIntercept);
    };
    // eslint-disable-next-line
  }, [accessToken, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
