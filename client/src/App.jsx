import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import Messages from './pages/Messages';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initiateSocket, disconnectSocket } from './services/socket';

import ErrorBoundary from './components/ErrorBoundary';

import { fetchUser } from './redux/slices/authSlice';

function App() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('App State:', { hasToken: !!token, hasUser: !!user });
    if (token && !user) {
      console.log('Fetching user profile...');
      dispatch(fetchUser());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (token && user) {
      initiateSocket(token, dispatch, user._id);
    }
    return () => disconnectSocket();
  }, [token, user, dispatch]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen text-slate-100 selection:bg-amber-500/30">
        <div className="max-w-[1440px] mx-auto flex justify-center">
          {token && user && (
            <aside className="hidden md:flex w-64 flex-shrink-0 sticky top-0 h-screen">
              <Sidebar />
            </aside>
          )}

          <main className="flex-grow min-h-screen border-x border-slate-800 w-full max-w-2xl">
            <Routes>
              <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/search" element={<Search />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/messages/:userId" element={<Messages />} />
              </Route>
            </Routes>
            <div className="h-20 md:hidden" /> {/* Spacer for mobile nav */}
          </main>

          {token && user && (
            <aside className="hidden lg:flex w-80 flex-shrink-0 border-l border-slate-800 sticky top-0 h-screen">
              <RightSidebar />
            </aside>
          )}
        </div>

        {token && user && <MobileNav />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
