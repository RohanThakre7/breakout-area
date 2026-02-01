import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Search, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const RightSidebar = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSuggestions = async () => {
        try {
            const res = await axios.get('/api/users/suggestions');
            setSuggestions(res.data);
        } catch (err) {
            console.error('Error fetching suggestions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && user) {
            fetchSuggestions();
        }
    }, [token, user]);

    const handleFollow = async (userId) => {
        try {
            await axios.post(`/api/users/follow/${userId}`);
            toast.success('User followed');
            // Remove followed user from suggestions
            setSuggestions(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            toast.error('Error following user');
        }
    };

    const trends = [
        { tag: '#BreakoutArea', posts: '1.2k' },
        { tag: '#MERNStack', posts: '850' },
        { tag: '#WebDev', posts: '2.5k' },
        { tag: '#TailwindCSS', posts: '5.2k' },
    ];

    return (
        <div className="h-full w-full p-4 overflow-y-auto space-y-6">
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search Breakout area"
                    className="w-full bg-slate-800 border-none rounded-full py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                />
            </div>

            {/* Trending Section */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white text-lg">What's happening</h3>
                </div>
                <div className="divide-y divide-slate-800">
                    {trends.map((trend) => (
                        <div key={trend.tag} className="p-4 hover:bg-slate-800 transition-colors cursor-pointer group">
                            <p className="text-sm text-slate-500">Trending</p>
                            <p className="font-bold text-white group-hover:text-amber-400">{trend.tag}</p>
                            <p className="text-xs text-slate-500">{trend.posts} posts</p>
                        </div>
                    ))}
                </div>
                <button className="w-full p-4 text-amber-400 text-left hover:bg-slate-800 transition-colors text-sm font-semibold">
                    Show more
                </button>
            </div>

            {/* Who to follow */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <h3 className="p-4 font-bold text-white text-lg border-b border-slate-800">Who to follow</h3>
                <div className="divide-y divide-slate-800">
                    {loading ? (
                        <div className="p-4 text-slate-500 text-sm animate-pulse text-center">Loading suggestions...</div>
                    ) : suggestions.length === 0 ? (
                        <div className="p-4 text-slate-500 text-sm text-center">No suggestions for now</div>
                    ) : (
                        suggestions.map((user) => (
                            <div key={user._id} className="p-4 flex items-center justify-between hover:bg-slate-800 transition-colors group">
                                <Link to={`/profile/${user._id}`} className="flex items-center gap-3 min-w-0">
                                    <div className="relative">
                                        <img
                                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                            className="w-10 h-10 rounded-full border border-slate-700 group-hover:border-amber-500 transition-colors"
                                            alt="avatar"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-white text-sm truncate group-hover:text-amber-400 transition-colors">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleFollow(user._id);
                                    }}
                                    className="bg-white text-slate-900 text-xs font-black px-4 py-2 rounded-full hover:bg-slate-200 transition-all active:scale-90"
                                >
                                    Follow
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <button className="w-full p-4 text-amber-400 text-left hover:bg-slate-800 transition-colors text-sm font-semibold">
                    Show more
                </button>
            </div>
        </div>
    );
};

export default RightSidebar;
