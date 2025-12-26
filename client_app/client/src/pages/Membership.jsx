import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';
import { motion } from 'framer-motion';

const Membership = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const userId = localStorage.getItem('userId');

    const plans = [
        {
            name: 'Basic Investor',
            price: '999',
            amount: 999,
            currency: 'INR',
            period: '/month',
            features: ['Access to basic listings', 'Public community access', 'Standard support'],
            recommended: false
        },
        {
            name: 'Pro Investor',
            price: '4,999',
            amount: 4999,
            currency: 'INR',
            period: '/month',
            features: ['Full deal flow access', 'Direct founder messaging', 'Investment analytics', 'Priority support'],
            recommended: true
        },
        {
            name: 'Institutional',
            price: '49,999',
            amount: 49999,
            currency: 'INR',
            period: '/year',
            features: ['API Access', 'Dedicated account manager', 'Custom deal sourcing', 'Legal assistance'],
            recommended: false
        },
    ];

    const handleSelectPlan = (plan) => {
        if (!userId) {
            alert("Please log in to upgrade.");
            return;
        }
        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const handleSuccess = async (details) => {
        try {
            // Call backend to update user
            await axios.post('http://localhost:5000/api/auth/membership', {
                userId,
                plan: selectedPlan.name,
                period: selectedPlan.period
            });
            alert(`Payment successful! Welcome to ${selectedPlan.name}.`);
            setShowPaymentModal(false);
        } catch (err) {
            console.error(err);
            alert("Payment recorded locally, but backend update failed.");
        }
    };

    return (
        <PayPalScriptProvider options={{ "client-id": "test" }}> {/* 'test' is the sandbox client ID */}
            <div className="max-w-6xl mx-auto relative">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">Membership Plans</h1>
                    <p className="mt-4 text-xl text-gray-600">Secure your spot in the future of finance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <motion.div
                            whileHover={{ y: -10 }}
                            key={plan.name}
                            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border ${plan.recommended ? 'border-indigo-500 transform scale-105 z-10' : 'border-gray-200'}`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-lg">
                                    Recommended
                                </div>
                            )}
                            <div className="p-8">
                                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                                    <span className="ml-1 text-xl text-gray-500">{plan.period}</span>
                                </div>
                                <ul className="mt-6 space-y-4 h-48">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <Check size={20} className="text-green-500 flex-shrink-0" />
                                            <p className="ml-3 text-base text-gray-700">{feature}</p>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8">
                                    <button
                                        onClick={() => handleSelectPlan(plan)}
                                        className={`w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium transition-colors ${plan.recommended ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                                    >
                                        Choose {plan.name}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Payment Modal */}
                {showPaymentModal && selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Checkout: {selectedPlan.name}</h2>
                                <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600 mb-2">Total Amount</p>
                                <p className="text-3xl font-bold text-indigo-600">₹{selectedPlan.price}</p>
                            </div>

                            <div className="min-h-[150px]">
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        currency_code: "INR",
                                                        value: selectedPlan.amount.toString(),
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            handleSuccess(details);
                                        });
                                    }}
                                    onError={(err) => {
                                        console.error(err);
                                        alert("PayPal Checkout failed");
                                    }}
                                />
                            </div>
                            <p className="text-xs text-center text-gray-400 mt-4">Safe and secure payment via PayPal Sandbox</p>
                        </motion.div>
                    </div>
                )}
            </div>
        </PayPalScriptProvider>
    );
};

export default Membership;
