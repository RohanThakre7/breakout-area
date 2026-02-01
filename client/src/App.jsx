import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initiateSocket, disconnectSocket } from './services/socket';

function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      initiateSocket(token, dispatch);
    }
    return () => disconnectSocket();
  }, [token, dispatch]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {token && <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
