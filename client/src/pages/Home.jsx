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
        <div className="max-w-2xl mx-auto space-y-6">
            <CreatePost />

            <div className="space-y-4">
                {loading && posts.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">Loading feed...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 bg-slate-800 rounded-xl border border-slate-700">
                        No posts yet. Follow people to see their posts here!
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

export default Home;
