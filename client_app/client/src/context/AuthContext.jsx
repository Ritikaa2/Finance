import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Configure Axios defaults
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/auth/me');
                setUser(res.data.data);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Error loading user', err);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
                setIsAuthenticated(false);
                delete axios.defaults.headers.common['Authorization'];
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    // Register User
    const register = async (userData) => {
        const res = await axios.post('http://localhost:5000/api/auth/register', userData);
        // OTP flow: response will contain otpSent: true, but NO token/user yet.
        return res.data;
    };

    // Verify Registration OTP & Login
    const verifyRegistration = async (email, otp) => {
        const res = await axios.post('http://localhost:5000/api/auth/register/verify', { email, otp });
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return user;
    };

    // Login User
    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return user;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    // Forgot Password
    const forgotPassword = async (email) => {
        const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
        return res.data;
    };

    // Verify OTP
    const verifyOtp = async (email, otp) => {
        const res = await axios.post('http://localhost:5000/api/auth/verifyotp', { email, otp });
        return res.data;
    };

    // Reset Password
    const resetPassword = async (resetToken, password) => {
        const res = await axios.put('http://localhost:5000/api/auth/resetpassword', { resetToken, password });
        return res.data;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                loading,
                register,
                login,
                logout,
                logout,
                forgotPassword,
                verifyOtp,
                forgotPassword,
                verifyOtp,
                resetPassword,
                verifyRegistration
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
