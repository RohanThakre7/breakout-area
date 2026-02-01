import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markRead } from '../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, UserPlus, Circle } from 'lucide-react';
import axios from 'axios';

const Notifications = () => {
    const dispatch = useDispatch();
    const { notifications, loading } = useSelector((state) => state.notifications);

    useEffect(() => {
        dispatch(fetchNotifications());
        return () => {
            dispatch(markRead());
            axios.post('/api/notifications/read'); // Mark as read in DB
        };
    }, [dispatch]);

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <Heart className="w-5 h-5 text-amber-500 fill-current" />;
            case 'comment': return <MessageCircle className="w-5 h-5 text-amber-500 fill-current" />;
            case 'follow': return <UserPlus className="w-5 h-5 text-amber-500" />;
            default: return null;
        }
    };

    const getMessage = (notification) => {
        switch (notification.type) {
            case 'like': return 'liked your post';
            case 'comment': return 'commented on your post';
            case 'follow': return 'started following you';
            default: return '';
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-20">
            {/* Notifications Header */}
            <div className="sticky top-0 z-10 p-4 glass-dark backdrop-blur-xl border-b border-slate-800 mb-6">
                <h2 className="text-xl font-bold text-white">Notifications</h2>
            </div>

            <div className="px-4 space-y-4">
                {loading && notifications.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 animate-pulse">Checking for updates...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20 glass rounded-2xl border border-slate-800 border-dashed">
                        <p className="text-slate-400">No notifications yet. Interactions will show up here!</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n._id}
                            className={`p-4 flex items-start gap-4 glass rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-all animate-fade-in ${!n.read ? 'bg-amber-600/5 border-amber-500/20' : ''}`}
                        >
                            <div className="mt-1 p-2 bg-slate-900 rounded-lg">{getIcon(n.type)}</div>
                            <img
                                src={n.sourceUser.avatarUrl || `https://ui-avatars.com/api/?name=${n.sourceUser.username}&background=random`}
                                alt="avatar"
                                className="w-12 h-12 rounded-full border border-slate-700"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-200">
                                    <span className="font-bold text-white">@{n.sourceUser.username}</span> {getMessage(n)}
                                </p>
                                {n.post && <p className="text-sm text-slate-500 mt-1 line-clamp-1 italic bg-slate-900/50 p-2 rounded-lg border border-slate-800">"{n.post.text}"</p>}
                                <p className="text-[10px] text-slate-600 mt-2 uppercase font-black tracking-widest">
                                    {formatDistanceToNow(new Date(n.createdAt))} ago
                                </p>
                            </div>
                            {!n.read && <Circle className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mt-2" />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
