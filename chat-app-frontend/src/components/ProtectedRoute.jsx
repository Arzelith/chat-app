import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { accessToken } = useSelector((storage) => storage.user);
  return accessToken ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
