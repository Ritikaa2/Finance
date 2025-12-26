import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const InvestmentModal = ({ startup, onClose, onSuccess }) => {
    const [amount, setAmount] = useState(1000);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // 1. Create Order
            const { data } = await axios.post('http://localhost:5000/api/payments/create-order', {
                amount: amount,
                startupId: startup._id
            }, config);

            if (!data.success) {
                setError(data.message || 'Failed to create order');
                setProcessing(false);
                return;
            }

            const { order, keyId } = data;

            // 2. Open Razorpay Checkout
            const options = {
                key: keyId, // Use the key returned by backend (matches the order creator)
                amount: order.amount,
                currency: order.currency,
                name: startup.companyName,
                description: `Investment in ${startup.companyName}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await axios.post('http://localhost:5000/api/payments/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            startupId: startup._id,
                            amount: amount
                        }, config);

                        if (verifyRes.data.success) {
                            onSuccess(amount);
                            onClose();
                            alert("Payment Successful!");
                        } else {
                            setError('Payment verification failed');
                        }
                    } catch (err) {
                        console.error(err);
                        setError('Payment verification failed');
                    }
                    setProcessing(false);
                },
                prefill: {
                    name: "Investor", // TODO: Get from user context
                    email: "investor@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#4F46E5"
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                setError(response.error.description);
                setProcessing(false);
            });
            rzp1.open();

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Something went wrong');
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" style={{ zIndex: 50 }}>
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(107, 114, 128, 0.75)', zIndex: 40 }}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
                    style={{
                        backgroundColor: 'white',
                        color: 'black',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        textAlign: 'left',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        maxWidth: '32rem',
                        width: '100%',
                        position: 'relative',
                        zIndex: 50
                    }}
                >
                    <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={onClose}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Invest in {startup.companyName}
                            </h3>
                            <div className="mt-2 text-sm text-gray-500">
                                <p>Enter the amount you wish to invest. Secured by Razorpay.</p>
                            </div>

                            <form onSubmit={handlePayment} className="mt-5 space-y-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (INR)</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            name="amount"
                                            id="amount"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            min="1"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-600 text-sm mt-2">{error}</div>
                                )}

                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-indigo-300"
                                    >
                                        {processing ? 'Processing...' : 'Pay with Razorpay'}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentModal;
