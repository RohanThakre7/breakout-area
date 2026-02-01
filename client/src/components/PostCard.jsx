import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const PostCard = ({ post }) => {
    const { user } = useSelector((state) => state.auth);
    const [liked, setLiked] = useState(post.likes.includes(user?._id));
    const [likesCount, setLikesCount] = useState(post.likes.length);

    const handleLike = async () => {
        try {
            const response = await axios.post(`/api/posts/${post._id}/like`);
            setLiked(response.data.liked);
            setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
        } catch (e) {
            toast.error('Error liking post');
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors">
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={post.author?.avatarUrl || `https://ui-avatars.com/api/?name=${post.author?.name}&background=random`}
                            alt="avatar"
                            className="w-10 h-10 rounded-full border border-slate-600"
                        />
                        <div>
                            <h4 className="font-bold text-white hover:underline cursor-pointer">{post.author?.name}</h4>
                            <p className="text-sm text-slate-400">@{post.author?.username} • {formatDistanceToNow(new Date(post.createdAt))} ago</p>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-white p-1 rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-slate-200 mb-4 whitespace-pre-wrap">{post.text}</p>

                {post.images?.length > 0 && (
                    <div className="rounded-xl overflow-hidden mb-4 border border-slate-700">
                        <img src={post.images[0]} alt="Post" className="w-full h-auto max-h-[500px] object-cover" />
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 group transition-colors ${liked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'}`}
                    >
                        <div className={`p-2 rounded-full transition-colors ${liked ? 'bg-pink-500/10' : 'group-hover:bg-pink-500/10'}`}>
                            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-sm font-medium">{likesCount}</span>
                    </button>

                    <button className="flex items-center gap-2 group text-slate-400 hover:text-blue-500 transition-colors">
                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">{post.commentsCount}</span>
                    </button>

                    <button className="flex items-center gap-2 group text-slate-400 hover:text-teal-500 transition-colors">
                        <div className="p-2 rounded-full group-hover:bg-teal-500/10 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
