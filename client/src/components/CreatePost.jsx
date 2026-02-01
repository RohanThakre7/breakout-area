import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../redux/slices/postSlice';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePost = () => {
    const [text, setText] = useState('');
    const [images, setImages] = useState([]); // In a real app, these would be file objects or URLs
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() && images.length === 0) return;

        const result = await dispatch(createPost({ text, images }));
        if (!result.error) {
            setText('');
            setImages([]);
            toast.success('Posted!');
        } else {
            toast.error('Failed to post');
        }
    };

    return (
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <img
                        src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border border-slate-600"
                    />
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's happening?"
                        className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder-slate-500"
                        rows="3"
                    />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <button
                        type="button"
                        className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-full transition-colors"
                        title="Add images"
                    >
                        <Image className="w-5 h-5" />
                    </button>

                    <button
                        type="submit"
                        disabled={!text.trim() && images.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-2 rounded-full flex items-center gap-2 transition-all"
                    >
                        <Send className="w-4 h-4" />
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
