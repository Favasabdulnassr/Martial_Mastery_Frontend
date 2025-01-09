import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '@/services/constents';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, role } = useSelector((state) => state.login);
    const navigate = useNavigate();

    useEffect(() => {
        if (role === 'admin') {
            navigate('/admin/dashboard');
        } else if (role === 'tutor') {
            navigate('/tutor/Profile');
        } else if (role === 'student') {
            navigate('/profile');
        }
    }, [isAuthenticated, role, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(BASE_URL+'/auth/forgot-password/', { email });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 font-roboto text-gray-100 flex items-center justify-center p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-md bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden p-8"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 w-full p-3 bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold p-3 rounded-xl disabled:opacity-50"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </motion.button>

                    <div className="text-center">
                        <a href="/login" className="text-cyan-400 hover:text-cyan-300">
                            Back to Login
                        </a>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};


export default ForgotPassword