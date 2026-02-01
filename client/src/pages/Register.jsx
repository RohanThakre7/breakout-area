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
        <div className="max-w-md mx-auto mt-16 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Join SocialHub</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="johndoe"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="•••••••• (min 6 chars)"
                        minLength="6"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
            <p className="mt-6 text-center text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:underline">
                    Login here
                </Link>
            </p>
        </div>
    );
};

export default Register;
