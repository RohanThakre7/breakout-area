import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Settings, Calendar, AtSign, Users } from 'lucide-react';
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
        <div className="max-w-3xl mx-auto">
            {/* Header / Cover Placeholder */}
            <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl relative">
                <div className="absolute -bottom-16 left-8 p-1 bg-slate-900 rounded-full border-4 border-slate-900">
                    <img
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&size=128&background=random`}
                        alt="avatar"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                </div>
            </div>

            {/* Profile Info */}
            <div className="bg-slate-800 rounded-b-2xl p-8 pt-20 border-x border-b border-slate-700">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                        <p className="text-slate-400 flex items-center gap-1">
                            <AtSign className="w-4 h-4" /> {user.username}
                        </p>
                    </div>

                    {isOwnProfile ? (
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-600 rounded-full hover:bg-slate-700 transition-colors">
                            <Settings className="w-4 h-4" /> Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            className={`px-6 py-2 rounded-full font-bold transition-all ${isFollowing ? 'border border-slate-600 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>

                <p className="text-slate-300 text-lg mb-6">{user.bio || 'No bio yet.'}</p>

                <div className="flex flex-wrap gap-6 text-slate-400 text-sm mb-6">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                        <span className="font-bold text-white">{user.following.length}</span> Following
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                        <span className="font-bold text-white">{user.followers.length}</span> Followers
                    </div>
                </div>
            </div>

            {/* User Posts */}
            <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold mb-4 px-2">Posts</h3>
                {posts.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 bg-slate-800 rounded-xl border border-slate-700">
                        No posts from this user yet.
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Profile;
