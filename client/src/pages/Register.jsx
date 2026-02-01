import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(register(formData));
        if (!result.error) {
            toast.success('Account created successfully!');
            navigate('/');
        } else {
            toast.error(result.payload?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in py-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent mb-2">
                        Breakout area
                    </h1>
                    <p className="text-slate-500 font-medium">Join the community and start sharing!</p>
                </div>

                <div className="glass-card p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <h2 className="text-2xl font-bold mb-8 text-white">Create Account</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all text-white placeholder-slate-600"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all text-white placeholder-slate-600"
                                placeholder="johndoe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all text-white placeholder-slate-600"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all text-white placeholder-slate-600"
                                placeholder="••••••••"
                                minLength="6"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Creating Account...' : 'Get Started'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 font-medium font-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-bold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
