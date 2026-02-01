import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, Search, Bell, User, LogOut, Settings, PlusSquare, MessageCircle } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notifications);
    const dispatch = useDispatch();
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Explore', path: '/search' },
        { icon: MessageCircle, label: 'Messages', path: '/messages' },
        { icon: Bell, label: 'Notifications', path: '/notifications', badge: unreadCount },
    ];

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="h-full w-full glass-panel flex flex-col p-4">
            <Link to="/" className="mb-8 px-4">
                <h1 className="text-2xl font-black bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                    Breakout area
                </h1>
            </Link>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <div className="relative">
                                <item.icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? 'fill-current' : ''}`} />
                                {item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`font-semibold text-lg ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                        </Link>
                    );
                })}

                <button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <PlusSquare className="w-5 h-5" />
                    <span>Post</span>
                </button>
            </nav>

            <div className="mt-auto border-t border-slate-800 pt-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors group">
                    <Link to={`/profile/${user?._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                            className="w-10 h-10 rounded-full border border-slate-700"
                            alt="user"
                        />
                        <div className="min-w-0">
                            <p className="font-bold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-sm text-slate-500 truncate">@{user?.username}</p>
                        </div>
                    </Link>
                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 p-2 rounded-full hover:bg-slate-900/50 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
