import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [statsData, setStatsData] = useState({
        totalInvestment: 0,
        activeStartups: 0,
        portfolioGrowth: 0,
        profileViews: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) return; // Should likely redirect to login

                const res = await axios.get(`http://localhost:5000/api/applications/stats?userId=${userId}`);
                if (res.data.success) {
                    setStatsData(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        {
            label: 'Total Investment',
            value: `₹${statsData.totalInvestment.toLocaleString('en-IN')}`,
            change: '+0% (Real)', // Dynamic calculation to be added later
            icon: DollarSign,
            color: 'bg-indigo-500'
        },
        {
            label: 'Active Startups',
            value: statsData.activeStartups,
            change: 'Tracked',
            icon: Users,
            color: 'bg-orange-500'
        },
        {
            label: 'Portfolio Growth',
            value: `${statsData.portfolioGrowth}%`,
            change: 'N/A',
            icon: TrendingUp,
            color: 'bg-green-500'
        },
        {
            label: 'Profile Views',
            value: statsData.profileViews,
            change: 'N/A',
            icon: Activity,
            color: 'bg-purple-500'
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Real-time overview of your investment portfolio.</p>
                </div>
                <Link to="/browse" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center">
                    Browse Startups <ArrowRight size={18} className="ml-2" />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                                <stat.icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-600 font-medium">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">View All</button>
                    </div>
                    {statsData.recentActivity.length === 0 ? (
                        <p className="text-gray-500">No recent activity found. Make your first investment!</p>
                    ) : (
                        <div className="space-y-6">
                            {statsData.recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <Activity size={18} />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-gray-900 font-medium">{activity.text}</p>
                                        <p className="text-xs text-gray-500">{new Date(activity.time).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions / Promo */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-2">Upgrade to Pro</h2>
                        <p className="text-indigo-100 text-sm mb-6">Get advanced analytics, direct messaging, and priority support.</p>
                        <Link to="/membership" className="inline-block bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">
                            View Plans
                        </Link>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
