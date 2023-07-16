import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { ProtectedRoute } from './components';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Error from './pages/Error';

const App = () => {
  const { accessToken } = useSelector((storage) => storage.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={accessToken ? <Navigate to='/' /> : <Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Chat />} />
        </Route>
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
