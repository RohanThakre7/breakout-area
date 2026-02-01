import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Search, Bell, User, PlusCircle } from 'lucide-react';

const MobileNav = () => {
    const { user } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notifications);
    const location = useLocation();

    const navItems = [
        { icon: Home, path: '/' },
        { icon: Search, path: '/search' },
        { icon: PlusCircle, path: '/create', special: true },
        { icon: Bell, path: '/notifications', badge: unreadCount },
        { icon: User, path: `/profile/${user?._id}` },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-6 py-3 flex justify-between items-center z-50">
            {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link key={index} to={item.path} className="relative group">
                        <item.icon
                            className={`w-7 h-7 transition-all ${item.special
                                ? 'text-amber-500 hover:scale-110'
                                : isActive
                                    ? 'text-white'
                                    : 'text-slate-500'
                                }`}
                            fill={isActive && !item.special ? 'currentColor' : 'none'}
                        />
                        {item.badge > 0 && (
                            <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] font-bold px-1 rounded-full border border-slate-900">
                                {item.badge}
                            </span>
                        )}
                        {isActive && !item.special && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export default MobileNav;
