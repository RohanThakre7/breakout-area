import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markRead } from '../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, UserPlus, Circle } from 'lucide-react';

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
            case 'like': return <Heart className="w-5 h-5 text-pink-500 fill-current" />;
            case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500 fill-current" />;
            case 'follow': return <UserPlus className="w-5 h-5 text-emerald-500" />;
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
        <div className="max-w-2xl mx-auto bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Notifications</h2>
            </div>

            <div className="divide-y divide-slate-700">
                {loading && notifications.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-10 text-center text-slate-400">No notifications yet.</div>
                ) : (
                    notifications.map((n) => (
                        <div key={n._id} className={`p-4 flex items-start gap-4 hover:bg-slate-700/50 transition-colors ${!n.read ? 'bg-blue-500/5' : ''}`}>
                            <div className="mt-1">{getIcon(n.type)}</div>
                            <img
                                src={n.sourceUser.avatarUrl || `https://ui-avatars.com/api/?name=${n.sourceUser.username}&background=random`}
                                alt="avatar"
                                className="w-10 h-10 rounded-full border border-slate-600"
                            />
                            <div className="flex-1">
                                <p className="text-slate-200">
                                    <span className="font-bold text-white">@{n.sourceUser.username}</span> {getMessage(n)}
                                </p>
                                {n.post && <p className="text-sm text-slate-400 mt-1 line-clamp-1 italic">"{n.post.text}"</p>}
                                <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">
                                    {formatDistanceToNow(new Date(n.createdAt))} ago
                                </p>
                            </div>
                            {!n.read && <Circle className="w-3 h-3 fill-blue-500 text-blue-500 mt-2" />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
