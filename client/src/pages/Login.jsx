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
        <div className="max-w-md mx-auto mt-16 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Login to SocialHub</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <p className="mt-6 text-center text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-400 hover:underline">
                    Register here
                </Link>
            </p>
        </div>
    );
};

export default Login;
