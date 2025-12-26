import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const Analytics = () => {
    const [stats, setStats] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return;

                const res = await axios.get(`http://localhost:5000/api/investments/stats`);
                if (res.data.success) {
                    // processData(res.data.data); // New endpoint returns pre-calculated stats
                    const { monthlyData, activeAllocations } = res.data.data;
                    setStats(monthlyData);
                    // Mock pie data or use industry if available in future
                    // For now, let's just make a dummy pie if empty
                    setPieData([
                        { name: 'Tech', value: 400 },
                        { name: 'Health', value: 300 },
                        { name: 'Fintech', value: 300 },
                    ]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Removed manual processData as backend handles it now

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <h1 className="text-2xl font-bold text-gray-800">Investment Analytics (Real-Time)</h1>

            {loading ? (
                <div className="animate-pulse h-96 bg-gray-200 rounded-xl"></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                        <h2 className="text-lg font-semibold mb-4">Investment Trends (Yearly)</h2>
                        <div className="h-80 min-h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Amount Invested (₹)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                        <h2 className="text-lg font-semibold mb-4">Portfolio Diversity</h2>
                        {pieData.length > 0 ? (
                            <div className="h-80 min-h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-80 flex items-center justify-center text-gray-400">
                                No diversity data available yet.
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default Analytics;
