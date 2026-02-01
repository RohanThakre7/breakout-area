import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Settings, Calendar, AtSign, Users, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const [userRes, postsRes] = await Promise.all([
                    axios.get(`/api/users/${id}`),
                    axios.get(`/api/posts/user/${id}`) // Note: Need to implement this route in backend
                ]);
                setUser(userRes.data);
                setPosts(postsRes.data || []);
                setIsFollowing(userRes.data.followers.some(f => f._id === currentUser?._id));
            } catch (e) {
                toast.error('Error fetching profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, currentUser?._id]);

    const handleFollow = async () => {
        try {
            const response = await axios.post(`/api/users/follow/${id}`);
            setIsFollowing(response.data.following);
            setUser(prev => ({
                ...prev,
                followers: response.data.following
                    ? [...prev.followers, currentUser]
                    : prev.followers.filter(f => f._id !== currentUser._id)
            }));
        } catch (e) {
            toast.error('Error updating follow status');
        }
    };

    if (loading) return <div className="text-center py-20">Loading profile...</div>;
    if (!user) return <div className="text-center py-20">User not found</div>;

    const isOwnProfile = currentUser?._id === user._id;

    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Header / Cover */}
            <div className="relative">
                <div className="h-48 bg-gradient-to-br from-slate-900 via-slate-950 to-black border-b border-slate-800 overflow-hidden rounded-t-3xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="absolute -bottom-16 left-8 p-1 glass-dark rounded-full z-10">
                    <img
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                        alt="avatar"
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-950 shadow-2xl"
                    />
                </div>
            </div>

            {/* Profile Info */}
            <div className="glass-dark rounded-b-3xl p-8 pt-20 border-x border-b border-slate-800 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-white">{user.name}</h1>
                        <p className="text-slate-400 flex items-center gap-1 font-medium">
                            <span className="text-amber-400">@</span>{user.username}
                        </p>
                    </div>

                    {isOwnProfile ? (
                        <button className="flex items-center gap-2 px-6 py-2.5 glass border border-slate-700 rounded-full hover:bg-slate-800 transition-all font-bold text-sm">
                            <Settings className="w-4 h-4" /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleFollow}
                                className={`px-8 py-2.5 rounded-full font-bold transition-all shadow-lg ${isFollowing
                                    ? 'glass border border-slate-700 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500'
                                    : 'bg-white text-slate-900 hover:bg-slate-200 shadow-white/10'
                                    }`}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                            <a
                                href={`/messages/${id}`}
                                className="p-2.5 rounded-full glass border border-slate-700 hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                                title="Message"
                            >
                                <MessageCircle className="w-6 h-6" />
                            </a>
                        </div>
                    )}
                </div>

                <p className="text-slate-300 text-lg mb-8 leading-relaxed">{user.bio || "This user hasn't added a bio yet."}</p>

                <div className="flex flex-wrap gap-8 text-slate-400">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span className="text-sm">Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-amber-400 transition-colors">
                        <span className="font-bold text-white">{user.following.length}</span>
                        <span className="text-sm">Following</span>
                    </div>
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-amber-400 transition-colors">
                        <span className="font-bold text-white">{user.followers.length}</span>
                        <span className="text-sm">Followers</span>
                    </div>
                </div>
            </div>

            {/* User Posts */}
            <div className="mt-12 px-4 md:px-0">
                <div className="flex items-center gap-2 mb-6 px-2">
                    <div className="w-1 h-6 bg-amber-500 rounded-full" />
                    <h3 className="text-xl font-bold text-white">Posts</h3>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 border-dashed">
                        <p className="text-slate-500">No posts from this user yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post._id} className="animate-fade-in">
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
