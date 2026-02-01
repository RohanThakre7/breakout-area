import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Bell, User, LogOut, Home, Search } from 'lucide-react';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    SocialHub
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="hover:text-blue-400 transition-colors">
                        <Home className="w-6 h-6" />
                    </Link>
                    <Link to="/search" className="hover:text-blue-400 transition-colors">
                        <Search className="w-6 h-6" />
                    </Link>
                    <Link to="/notifications" className="relative hover:text-blue-400 transition-colors">
                        <Bell className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                    <Link to={`/profile/${user?._id}`} className="hover:text-blue-400 transition-colors">
                        <User className="w-6 h-6" />
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
