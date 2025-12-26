import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Phone, Video, Search, User as UserIcon } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSocket } from '../context/SocketContext';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const userId = user?._id;
    const messagesEndRef = useRef(null);
    const { socket } = useSocket();

    useEffect(() => {
        if (userId) {
            fetchMessages();
        }
    }, [userId]);

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (newMessage) => {
            // Only add if not already present (optimistic updates might cause dupes)
            setMessages((prev) => {
                // Check if msg exists
                if (prev.find(m => m.id === newMessage._id)) return prev;

                const senderId = newMessage.sender ? newMessage.sender._id : 'unknown';
                const senderName = newMessage.sender ? newMessage.sender.name : 'Unknown User';

                return [...prev, {
                    id: newMessage._id,
                    text: newMessage.text,
                    sender: senderId === userId ? 'me' : 'them',
                    name: senderName,
                    time: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }];
            });
        });

        return () => socket.off('receive_message');
    }, [socket, userId]);

    const fetchMessages = async () => {
        try {
            if (!userId) return;
            const res = await axios.get(`http://localhost:5000/api/messages?userId=${userId}`);
            if (res.data.success) {
                // Determine if it's 'me' or 'them' based on userId
                const formatted = res.data.data.map(msg => {
                    const senderId = msg.sender ? msg.sender._id : 'unknown';
                    const senderName = msg.sender ? msg.sender.name : 'Unknown User';

                    return {
                        id: msg._id,
                        text: msg.text,
                        sender: senderId === userId ? 'me' : 'them',
                        name: senderName,
                        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                });
                setMessages(formatted);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('http://localhost:5000/api/messages', {
                sender: userId,
                receiver: 'global_room', // Placeholder for now
                text: newMessage
            });
            setNewMessage('');
            fetchMessages(); // Refresh immediately
        } catch (err) {
            console.error("Failed to send", err);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-8rem)] flex">
            {/* Sidebar List (Static for now as we don't have real "Rooms" logic in backend, just one global chat) */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col hidden md:flex">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 bg-indigo-50 border-l-4 border-l-indigo-600">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900">Global Founder Room</h3>
                            <span className="text-xs text-gray-500">Now</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">Connect with everyone...</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Global Chat</h3>
                            <p className="text-xs text-green-600 flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> Live
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20">No messages yet. Say hello!</div>
                    ) : (
                        messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-md ${msg.sender === 'me'
                                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none'
                                    }`}>
                                    <p className="text-xs opacity-70 mb-1">{msg.name}</p>
                                    <p>{msg.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.time}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg"
                        >
                            <Send size={20} />
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Messages;
