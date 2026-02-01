import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeed } from '../redux/slices/postSlice';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Home = () => {
    const dispatch = useDispatch();
    const { posts, loading } = useSelector((state) => state.posts);

    useEffect(() => {
        dispatch(fetchFeed());
    }, [dispatch]);

    return (
        <div className="max-w-2xl mx-auto pb-20">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 p-4 glass-dark backdrop-blur-xl border-b border-slate-800 mb-6">
                <h2 className="text-xl font-bold text-white">Home</h2>
            </div>

            <div className="px-4 space-y-6">
                <CreatePost />

                <div className="space-y-4">
                    {loading && posts.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 animate-pulse">Loading your feed...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                            <p className="text-slate-400">No posts yet. Follow people to see their posts here!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="animate-fade-in">
                                <PostCard post={post} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
