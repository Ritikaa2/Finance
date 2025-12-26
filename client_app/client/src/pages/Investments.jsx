import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Investments = () => {
    const [investments, setInvestments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                // Fetch from new Investments endpoint
                const [invRes, statsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/investments`),
                    axios.get(`http://localhost:5000/api/investments/stats`)
                ]);

                if (invRes.data.success) {
                    setInvestments(invRes.data.data);
                }
                if (statsRes.data.success) {
                    setStats(statsRes.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
                <button
                    onClick={() => window.location.href = '/browse'}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-md flex items-center transform transition hover:scale-105"
                >
                    Discover New Startups <ArrowRight size={16} className="ml-2" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Total Invested</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalInvested.toLocaleString()}</p>
                </motion.div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Active Allocations</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{investments.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">Projected Returns</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">~12.5%</p>
                </div>
            </div>

            {/* Portfolio Charts */}
            {stats && stats.portfolioDiversity && stats.portfolioDiversity.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio Diversity</h3>
                        <div className="h-64 min-h-[256px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.portfolioDiversity}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {stats.portfolioDiversity.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center"><Loader className="animate-spin text-indigo-600" /></div>
                ) : investments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No investments found. Start exploring!</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="p-4 font-medium">Startup</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Invested (INR)</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {investments.map((inv) => (
                                <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-semibold text-gray-900">{inv.startup.companyName}</td>
                                    <td className="p-4 text-gray-600">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize">
                                            {inv.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">₹{inv.amount.toLocaleString()}</td>
                                    <td className="p-4 text-gray-500 text-sm">{new Date(inv.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );
};

export default Investments;
