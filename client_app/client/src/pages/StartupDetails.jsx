import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, MapPin, Globe, DollarSign, TrendingUp, Users } from 'lucide-react';

import InvestmentModal from '../components/InvestmentModal';


const StartupDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userRole = localStorage.getItem('role'); // Check role

    useEffect(() => {
        fetchStartup();
    }, [id]);

    const fetchStartup = async () => {
        try {
            console.log("Fetching startup details for ID:", id);
            const res = await axios.get(`http://localhost:5000/api/startups/${id}`);
            console.log("Startup Fetch Response:", res.data);
            if (res.data.success) {
                setStartup(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching startup:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvestClick = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: location.pathname } });
            return;
        }
        setIsModalOpen(true);
    };

    const handleInvestmentSuccess = (amount) => {
        alert(`Successfully invested ₹${amount} in ${startup.companyName}!`);
        setIsModalOpen(false);
        fetchStartup(); // Refresh data to show updated raised amount
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!startup) return <div className="p-8 text-center">Startup not found.</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-48 bg-indigo-600 sm:h-64 relative">
                        {/* Banner Placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-600 opacity-90"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h1 className="text-3xl font-bold">{startup.companyName}</h1>
                            <p className="opacity-90">{startup.location || 'Location not specified'}</p>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-gray-100 pb-8">
                            <div className="flex items-center">
                                <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 mr-4">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Stage</p>
                                    <p className="font-semibold">{startup.stage}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg text-green-600 mr-4">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Raised</p>
                                    <p className="font-semibold">₹{(startup.raisedAmount || 0).toLocaleString()} / ₹{(startup.fundingGoal || 0).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-lg text-purple-600 mr-4">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Industry</p>
                                    <p className="font-semibold">{startup.industry}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">About</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{startup.description}</p>
                            </div>

                            {startup.website && (
                                <div className="flex items-center text-indigo-600">
                                    <Globe className="mr-2" size={18} />
                                    <a href={startup.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {startup.website}
                                    </a>
                                </div>
                            )}

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Opportunity</h3>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500">Minimum Investment</p>
                                        <p className="font-semibold text-gray-900">₹1,000</p>
                                    </div>

                                    <button
                                        onClick={handleInvestClick}
                                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition-transform transform hover:-translate-y-0.5"
                                    >
                                        Invest Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <InvestmentModal
                    startup={startup}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleInvestmentSuccess}
                />
            )}
        </div>
    );
};

export default StartupDetails;
