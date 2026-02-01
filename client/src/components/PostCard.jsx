import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Edit2, X, Check, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { deletePost, updatePost } from '../redux/slices/postSlice';

const PostCard = ({ post }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [liked, setLiked] = useState(post.likes.includes(user?._id));
    const [likesCount, setLikesCount] = useState(post.likes.length);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.text);

    // Comments State
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentsCount, setCommentsCount] = useState(post.commentsCount);
    const [loadingComments, setLoadingComments] = useState(false);

    // Menu State
    const [showMenu, setShowMenu] = useState(false);

    const isAuthor = user?._id === post.author?._id;

    const handleLike = async () => {
        try {
            const response = await axios.post(`/api/posts/${post._id}/like`);
            setLiked(response.data.liked);
            setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
        } catch (e) {
            toast.error('Error liking post');
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            dispatch(deletePost(post._id))
                .unwrap()
                .then(() => toast.success('Post deleted'))
                .catch(() => toast.error('Failed to delete post'));
        }
    };

    const handleUpdate = () => {
        if (!editText.trim()) return;
        dispatch(updatePost({ postId: post._id, updates: { text: editText } }))
            .unwrap()
            .then(() => {
                setIsEditing(false);
                toast.success('Post updated');
            })
            .catch(() => toast.error('Failed to update post'));
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            setLoadingComments(true);
            try {
                const res = await axios.get(`/api/posts/${post._id}/comments`);
                setComments(res.data);
            } catch (error) {
                toast.error('Failed to load comments');
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const res = await axios.post(`/api/posts/${post._id}/comment`, { text: commentText });
            setComments(prev => [res.data, ...prev]);
            setCommentsCount(prev => prev + 1);
            setCommentText('');
            toast.success('Comment added');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl mb-6 animate-fade-in group/card">
            <div className="flex items-start gap-4">
                {/* Author Avatar */}
                <Link to={`/profile/${post.author?._id}`}>
                    <img
                        src={post.author?.avatarUrl || `https://ui-avatars.com/api/?name=${post.author?.username}&background=random`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full border border-slate-700 hover:border-amber-500 transition-colors"
                    />
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 relative">
                        <div className="flex items-center gap-2 truncate">
                            <Link to={`/profile/${post.author?._id}`} className="font-bold text-white hover:underline truncate">
                                {post.author?.name}
                            </Link>
                            <span className="text-slate-500 text-sm truncate">@{post.author?.username}</span>
                            <span className="text-slate-500 text-sm">•</span>
                            <span className="text-slate-500 text-sm">{formatDistanceToNow(new Date(post.createdAt))}</span>
                        </div>

                        {isAuthor && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>

                                {showMenu && (
                                    <div className="absolute right-0 top-10 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-10 overflow-hidden">
                                        <button
                                            onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => { handleDelete(); setShowMenu(false); }}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-red-400 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mb-4">
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                                rows="3"
                            />
                            <div className="flex gap-2 mt-2 justify-end">
                                <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                                <button onClick={handleUpdate} className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg">
                                    <Check className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-200 text-lg mb-4 leading-relaxed whitespace-pre-wrap">{post.text}</p>
                    )}

                    {post.images?.length > 0 && !isEditing && (
                        <div className={`mt-4 rounded-2xl overflow-hidden border border-slate-800 grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                            }`}>
                            {post.images.slice(0, 4).map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`Post content ${i + 1}`}
                                    className={`w-full h-auto object-cover ${post.images.length === 1 ? 'max-h-[500px]' : 'aspect-square'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between max-w-md mt-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 group/btn transition-colors ${liked ? 'text-amber-500' : 'text-slate-500 hover:text-amber-500'}`}
                        >
                            <div className={`p-2.5 rounded-full transition-colors ${liked ? 'bg-amber-500/10' : 'group-hover/btn:bg-amber-500/10'}`}>
                                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                            </div>
                            <span className="text-sm font-semibold">{likesCount}</span>
                        </button>

                        <button
                            onClick={toggleComments}
                            className={`flex items-center gap-2 group/btn transition-colors ${showComments ? 'text-amber-500' : 'text-slate-500 hover:text-amber-500'}`}
                        >
                            <div className={`p-2.5 rounded-full transition-colors ${showComments ? 'bg-amber-500/10' : 'group-hover/btn:bg-amber-500/10'}`}>
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold">{commentsCount}</span>
                        </button>

                        <button className="flex items-center gap-2 group/btn text-slate-500 hover:text-amber-500 transition-colors">
                            <div className="p-2.5 rounded-full group-hover/btn:bg-amber-500/10 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </div>
                        </button>
                    </div>

                    {/* Comments Section */}
                    {showComments && (
                        <div className="mt-4 pt-4 border-t border-slate-800 animate-fade-in">
                            <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                                <img
                                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                                    className="w-8 h-8 rounded-full"
                                    alt="user"
                                />
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Post your reply..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-4 pr-10 text-slate-200 focus:outline-none focus:border-amber-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!commentText.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500 disabled:text-slate-600 hover:bg-amber-500/10 p-1.5 rounded-lg transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-4">
                                {loadingComments ? (
                                    <div className="text-center text-slate-500 py-2">Loading comments...</div>
                                ) : comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment._id} className="flex gap-3 group">
                                            <Link to={`/profile/${comment.author?._id}`}>
                                                <img
                                                    src={comment.author?.avatarUrl || `https://ui-avatars.com/api/?name=${comment.author?.username}&background=random`}
                                                    className="w-8 h-8 rounded-full border border-slate-800"
                                                    alt="avatar"
                                                />
                                            </Link>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Link to={`/profile/${comment.author?._id}`} className="font-bold text-sm text-white hover:underline">
                                                        {comment.author?.name}
                                                    </Link>
                                                    <span className="text-xs text-slate-500">
                                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-slate-300 text-sm mt-0.5">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-500 text-sm py-2">No comments yet. Be the first to say something!</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostCard;
