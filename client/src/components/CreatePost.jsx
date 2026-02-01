import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
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

        // In a real app with Multer, we might have already uploaded or we upload now
        // For this implementation, we allow the post to be created with the URLs we got from the upload step
        const result = await dispatch(createPost({ text, images }));
        if (!result.error) {
            setText('');
            setImages([]);
            toast.success('Posted!');
        } else {
            toast.error('Failed to post');
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach(file => formData.append('images', file));

        try {
            toast.loading('Uploading images...', { id: 'upload' });
            const response = await axios.post('/api/upload', formData);
            setImages(prev => [...prev, ...response.data.urls]);
            toast.success('Images uploaded!', { id: 'upload' });
        } catch (error) {
            toast.error('Failed to upload images', { id: 'upload' });
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl mb-8 group">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <Link to={`/profile/${user?._id}`}>
                        <img
                            src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
                            alt="avatar"
                            className="w-12 h-12 rounded-full border border-slate-700 hover:border-amber-500 transition-colors"
                        />
                    </Link>
                    <div className="flex-1">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full bg-transparent border-none focus:ring-0 text-xl resize-none placeholder-slate-500 min-h-[100px] text-white"
                        />

                        {/* Image Preview */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {images.map((img, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden group/img">
                                        <img src={img} alt="preview" className="w-full h-40 object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute top-2 right-2 p-1.5 bg-slate-900/80 rounded-full text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-1">
                        <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="image-upload"
                            className="text-amber-400 hover:bg-amber-400/10 p-2.5 rounded-full transition-colors cursor-pointer"
                            title="Add images"
                        >
                            <Image className="w-5 h-5" />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!text.trim() && images.length === 0}
                        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold px-8 py-2.5 rounded-full flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                    >
                        <span>Post</span>
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
