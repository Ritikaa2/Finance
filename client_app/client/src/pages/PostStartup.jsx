import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Upload } from 'lucide-react';

const PostStartup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        industry: '',
        stage: 'Seed',
        fundingGoal: '',
        location: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Assuming auth header is set globally or we need to check AuthContext
            // AuthContext sets it in axios defaults usually.

            const res = await axios.post('http://localhost:5000/api/startups', formData);
            if (res.data.success) {
                alert('Startup posted successfully!');
                navigate('/dashboard'); // or /browse
            }
        } catch (err) {
            console.error(err);
            alert('Failed to post startup: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Post a New Startup</h1>
                <p className="text-gray-500 mt-2">Share your venture with investors.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="companyName"
                            required
                            value={formData.companyName}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="Acme Corp"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">One-Line Pitch / Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="What does your company do?"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Industry</label>
                        <select
                            name="industry"
                            required
                            value={formData.industry}
                            onChange={handleChange}
                            className="mt-1 block w-full content-center py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select...</option>
                            <option value="Fintech">Fintech</option>
                            <option value="Healthtech">Healthtech</option>
                            <option value="Edtech">Edtech</option>
                            <option value="SaaS">SaaS</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="GreenTech">GreenTech</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stage</label>
                        <select
                            name="stage"
                            required
                            value={formData.stage}
                            onChange={handleChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Pre-Seed">Pre-Seed</option>
                            <option value="Seed">Seed</option>
                            <option value="Series A">Series A</option>
                            <option value="Series B+">Series B+</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Funding Goal (₹)</label>
                        <input
                            type="number"
                            name="fundingGoal"
                            required
                            min="1000"
                            value={formData.fundingGoal}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="City, Country"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="https://..."
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                    >
                        {loading ? 'Posting...' : 'Post Startup'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostStartup;
