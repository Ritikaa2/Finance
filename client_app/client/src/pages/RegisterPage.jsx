import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'startup' });
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Register, 2: OTP
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { register, verifyRegistration } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await register(formData);
            if (res.otpSent) {
                setStep(2);
                if (res.debug && res.debug.otp) {
                    setMessage(`DEV MODE OTP: ${res.debug.otp}`);
                } else {
                    setMessage(res.data || 'OTP sent to your email.');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await verifyRegistration(formData.email, otp);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {step === 1 ? 'Create a new account' : 'Verify Email'}
                </h2>
                {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}
                {step === 2 && <p className="mt-2 text-center text-sm text-gray-600">Please enter the 6-digit OTP sent to {formData.email}</p>}
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {step === 1 ? (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">I am a...</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value="startup">Startup Founder</option>
                                <option value="investor">Investor</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign Up
                            </button>
                        </div>
                        <div className="text-sm text-center">
                            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Already have an account?</Link>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleVerify}>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">One-Time Password (OTP)</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    placeholder="Enter 6-digit OTP"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 tracking-widest text-center text-2xl"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Verify & Login
                            </button>
                        </div>
                        <div className="text-sm text-center">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="font-semibold text-indigo-600 hover:text-indigo-500"
                            >
                                Back to Registration
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
