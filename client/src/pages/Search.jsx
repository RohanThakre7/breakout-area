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
        <div className="max-w-2xl mx-auto">
            <div className="relative mb-8">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for users or posts..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-lg transition-all"
                />
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-slate-400">Searching...</div>
                ) : query && results.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">No users found matching "{query}"</div>
                ) : (
                    results.map((user) => (
                        <Link
                            to={`/profile/${user._id}`}
                            key={user._id}
                            className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-700/50 transition-all group"
                        >
                            <img
                                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt="avatar"
                                className="w-12 h-12 rounded-full border border-slate-600"
                            />
                            <div className="flex-1">
                                <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{user.name}</h4>
                                <p className="text-sm text-slate-400 flex items-center gap-0.5">
                                    <AtSign className="w-3 h-3" />{user.username}
                                </p>
                                {user.bio && <p className="text-sm text-slate-300 mt-1 line-clamp-1">{user.bio}</p>}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Search;
