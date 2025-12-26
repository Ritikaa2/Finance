import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, DollarSign, Briefcase } from 'lucide-react';

const BrowseStartups = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));

    useEffect(() => {
        fetchStartups();
    }, []);

    const fetchStartups = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/startups');
            if (res.data.success) {
                setStartups(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Discover Startups</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => window.location.href = '/post-startup'}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md font-medium flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Post Your Idea
                        </button>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search industries..."
                                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : startups.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
                            <Briefcase className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">No startups found</h3>
                        <p className="mt-2 text-gray-500 max-w-sm mx-auto">Be the first to list a startup and get funding from our network of investors.</p>
                        <div className="mt-6">
                            <button
                                onClick={() => window.location.href = '/post-startup'}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Post Your Startup
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {startups.map((startup) => (
                            <div key={startup._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-gray-900">{startup.companyName}</h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {startup.stage}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-gray-600 text-sm line-clamp-3">{startup.description}</p>

                                    <div className="mt-4 flex items-center text-sm text-gray-500">
                                        <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4" />
                                        {startup.industry}
                                    </div>

                                    <div className="mt-4 flex justify-between items-center text-sm">
                                        <div>
                                            <p className="text-gray-500">Goal</p>
                                            <p className="font-semibold text-gray-900">₹{startup.fundingGoal.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Raised</p>
                                            <p className="font-semibold text-green-600">₹{startup.raisedAmount.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.location.href = `/startup/${startup._id}`}
                                        className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        View Details & Invest
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseStartups;
