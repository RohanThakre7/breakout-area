import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, Image, Search, MoreVertical, Phone, Video } from 'lucide-react';
import { getSocket } from '../services/socket';
import { format } from 'date-fns';

const Messages = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto-scroll when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch conversations (people you follow)
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get('/api/messages/contacts');
                setConversations(res.data);

                // If userId is in URL, select that user
                if (userId) {
                    const user = res.data.find(u => u._id === userId);
                    if (user) setSelectedUser(user);
                    // If user is not in contacts (e.g. from profile), fetch their details separately could be an enhancement
                    // For now, we assume you can only message people you follow based on the plan.
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchConversations();
    }, [userId]);

    // Fetch messages for selected user
    useEffect(() => {
        if (!selectedUser) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/api/messages/conversation/${selectedUser._id}`);
                setMessages(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();
    }, [selectedUser?._id]);

    // Listen for incoming messages
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleMessage = (message) => {
            console.log('Socket: received new message', message);
            const senderId = message.sender._id || message.sender;
            if (selectedUser && senderId === selectedUser._id) {
                setMessages(prev => {
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
            }
        };

        socket.on('receive_message', handleMessage);
        return () => socket.off('receive_message', handleMessage);
    }, [selectedUser?._id, getSocket()]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || isSending) return;

        try {
            setIsSending(true);
            const res = await axios.post(`/api/messages/send/${selectedUser._id}`, {
                text: newMessage
            });

            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] md:h-screen flex max-w-7xl mx-auto md:py-4 gap-4">
            {/* Sidebar (Conversation List) */}
            <div className={`w-full md:w-1/3 glass-panel rounded-2xl flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-slate-800">
                    <h1 className="text-2xl font-black text-white mb-4">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search people..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-500/50 text-white placeholder-slate-600"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map(user => (
                        <div
                            key={user._id}
                            onClick={() => {
                                setSelectedUser(user);
                                navigate(`/messages/${user._id}`);
                            }}
                            className={`p-4 flex items-center gap-3 hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedUser?._id === user._id ? 'bg-amber-500/10 border-r-2 border-amber-500' : ''}`}
                        >
                            <div className="relative">
                                <img
                                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full border border-slate-700"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-200 truncate">{user.name}</h3>
                                <p className="text-sm text-slate-500 truncate">@{user.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`w-full md:w-2/3 glass rounded-2xl flex flex-col ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between backdrop-blur-md rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedUser(null);
                                        navigate('/messages');
                                    }}
                                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                                >
                                    ←
                                </button>
                                <img
                                    src={selectedUser.avatarUrl || `https://ui-avatars.com/api/?name=${selectedUser.username}&background=random`}
                                    alt={selectedUser.username}
                                    className="w-10 h-10 rounded-full border border-slate-700"
                                />
                                <div>
                                    <h3 className="font-bold text-white">{selectedUser.name}</h3>
                                    <p className="text-xs text-amber-500 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Phone className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Video className="w-5 h-5" /></button>
                                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><MoreVertical className="w-5 h-5" /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender._id === currentUser._id || msg.sender === currentUser._id;
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl p-4 ${isMe
                                            ? 'bg-amber-500 text-black rounded-tr-none'
                                            : 'bg-slate-800 text-white rounded-tl-none'
                                            }`}>
                                            <p>{msg.text}</p>
                                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-black/60' : 'text-slate-400'}`}>
                                                {format(new Date(msg.createdAt), 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-800">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <button type="button" className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-full transition-colors">
                                    <Image className="w-6 h-6" />
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-3 text-white focus:outline-none focus:border-amber-500 placeholder-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || isSending}
                                    className="p-3 bg-amber-500 text-black rounded-full hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                                >
                                    {isSending ? (
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-10 h-10 text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Select a message</h2>
                        <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
