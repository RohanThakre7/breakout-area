import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        if (!result.error) {
            toast.success('Welcome back!');
            navigate('/');
        } else {
            toast.error(result.payload?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent mb-2">
                        Breakout area
                    </h1>
                    <p className="text-slate-500 font-medium">Welcome back! Please login to continue.</p>
                </div>

                <div className="glass-card p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <h2 className="text-2xl font-bold mb-8 text-white">Login</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all text-white placeholder-slate-600"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3 focus:ring-2 focus:ring-amber-500/50 outline-none transition-all text-white placeholder-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 font-medium font-sm">
                        New here?{' '}
                        <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors font-bold">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
