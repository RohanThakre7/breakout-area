import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search as SearchIcon, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoading(true);
                try {
                    const response = await axios.get(`/api/users/search?q=${query}`);
                    setResults(response.data);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="max-w-2xl mx-auto pb-20">
            {/* Search Header */}
            <div className="sticky top-0 z-10 p-4 glass-dark backdrop-blur-xl border-b border-slate-800 mb-6">
                <div className="relative group">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for people..."
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-full pl-12 pr-4 py-3 text-lg focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="px-4 space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-slate-500 animate-pulse">Searching the hub...</div>
                ) : query && results.length === 0 ? (
                    <div className="text-center py-20 glass rounded-2xl border border-slate-800 border-dashed">
                        <p className="text-slate-400">No users found matching "<span className="text-white font-semibold">{query}</span>"</p>
                    </div>
                ) : (
                    results.map((user) => (
                        <Link
                            to={`/profile/${user._id}`}
                            key={user._id}
                            className="flex items-center gap-4 glass p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all group animate-fade-in"
                        >
                            <img
                                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                alt="avatar"
                                className="w-14 h-14 rounded-full border border-slate-700 group-hover:border-amber-500 transition-colors"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white text-lg group-hover:text-amber-400 transition-colors truncate">{user.name}</h4>
                                <p className="text-sm text-slate-400 flex items-center gap-0.5 font-medium">
                                    <span className="text-amber-500">@</span>{user.username}
                                </p>
                                {user.bio && <p className="text-sm text-slate-500 mt-1 line-clamp-1 italic">{user.bio}</p>}
                            </div>
                            <button className="bg-black text-white text-xs font-black px-5 py-2 rounded-full border border-slate-700 hover:bg-slate-900 transition-colors">
                                View Profile
                            </button>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Search;
