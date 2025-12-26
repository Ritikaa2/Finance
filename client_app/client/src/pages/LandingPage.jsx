import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Users, Rocket, Globe, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
    const [stats, setStats] = useState({
        capitalDeployed: 0,
        activeInvestors: 0,
        startupsInfo: 0
    });
    const [selectedFeature, setSelectedFeature] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/public/stats');
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch public stats", err);
            }
        };
        fetchStats();
    }, []);

    const statItems = [
        { label: 'Capital Deployed', value: `₹${stats.capitalDeployed.toLocaleString()}+` },
        { label: 'Active Investors', value: `${stats.activeInvestors}+` },
        { label: 'Startups Info', value: `${stats.startupsInfo}+` },
    ];

    const features = [
        {
            name: 'Global Investor Network',
            description: 'Access thousands of vetted angel investors and VCs looking for opportunities worldwide.',
            details: 'Our network spans 50+ countries, connecting you with capital that understands your local market while providing global reach. We vet every investor to ensure serious interest and capability.',
            icon: Globe,
            color: 'bg-blue-500',
        },
        {
            name: 'Smart Matching AI',
            description: 'Our proprietary algorithm matches you with investors interested in your specific industry and stage.',
            details: 'Using advanced machine learning, we analyze your pitch deck and financials to predict the investors most likely to fund you. Stop wasting time on cold emails.',
            icon: Zap,
            color: 'bg-indigo-500',
        },
        {
            name: 'Bank-Grade Security',
            description: 'End-to-end encryption for your data, documents, and communications throughout the due diligence process.',
            details: 'We use 256-bit SSL encryption and SOC2 compliant data centers. Your intellectual property and financial data are safe with us. Control exactly who sees what and when.',
            icon: Shield,
            color: 'bg-green-500',
        },
    ];

    return (
        <div className="bg-white overflow-hidden font-sans">
            {/* Hero Section */}
            <div className="relative isolate min-h-screen flex items-center justify-center">
                {/* Gradient Background */}
                <div className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 sm:text-7xl drop-shadow-sm">
                            Funding the Future <br /> of Innovation
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                            Connect with top-tier investors, showcase your breakthrough startup, and secure the capital you need to scale.
                            Your journey from Seed to Unicorn starts here.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/register" className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all flex items-center">
                                    Start Your Journey <Rocket className="ml-2 h-4 w-4" />
                                </Link>
                            </motion.div>
                            <Link to="/browse" className="text-sm font-semibold leading-6 text-gray-900 flex items-center group">
                                Browse Startups <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Stats/Social Proof */}
            <div className="bg-gray-900 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-y-8 gap-x-8 text-center lg:grid-cols-3">
                        {statItems.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="mx-auto flex max-w-xs flex-col gap-y-4"
                            >
                                <dt className="text-base leading-7 text-gray-400">{stat.label}</dt>
                                <dd className="order-first text-3xl font-bold tracking-tight text-white sm:text-5xl">{stat.value}</dd>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 sm:py-32 bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600">Why SeedX?</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to raise capital
                        </p>
                    </div>

                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                                    onClick={() => setSelectedFeature(feature)}
                                    className="flex flex-col bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full cursor-pointer hover:border-indigo-100 transition-colors"
                                >
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shadow-lg text-white ${feature.color}`}>
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                        <p className="flex-auto">{feature.description}</p>
                                        <p className="mt-6">
                                            <span className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 transition-colors">
                                                Learn more <span aria-hidden="true">→</span>
                                            </span>
                                        </p>
                                    </dd>
                                </motion.div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Feature Slide Modal */}
            <AnimatePresence>
                {selectedFeature && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedFeature(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={selectedFeature.name}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full z-10 overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>

                            <div className={`inline-flex items-center justify-center p-3 rounded-xl ${selectedFeature.color} text-white mb-6 shadow-md`}>
                                <selectedFeature.icon size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedFeature.name}</h3>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                {selectedFeature.details}
                            </p>

                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <p className="text-sm text-indigo-800 font-medium">
                                    💡 "This feature is designed to increase your success rate by 40%."
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                            >
                                Got it
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* CTA */}
            <div className="relative isolate py-16 sm:py-24 bg-indigo-900 text-white overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to transform your future?</h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                        Join 2,000+ founders who found their perfect match on SeedX.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link to="/register" className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-indigo-900 shadow-md hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors">
                            Get Started for Free
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <p className="text-gray-400">© 2025 SeedX, Inc. All rights reserved.</p>
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SeedX</h1>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
