import React, { useEffect, useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BASE_URL } from '@/services/constents';
import { useFormik } from 'formik';
import { ResetPasswordValidationSchema } from '@/services/validation/ResetPassword';

const ResetPassword = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useParams();
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




    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: ''
        },
        validationSchema: ResetPasswordValidationSchema,
        onSubmit: async (values) => {

            setIsLoading(true);
            try {
                const response = await axios.post(BASE_URL + `/auth/reset-password/${token}/`, {
                    newPassword: values.newPassword
                });
                toast.success(response.data.message);
                navigate('/login');
            } catch (error) {
                toast.error(error.response?.data?.error || 'Failed to reset password');
            } finally {
                setIsLoading(false);
            }
        }
    });


    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 font-roboto text-gray-100 flex items-center justify-center p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-md bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden p-8"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name='newPassword'
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="pl-10 pr-10 w-full p-3 bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                placeholder="Enter new password"
                                required
                            />
                            {formik.errors.newPassword && formik.touched.newPassword && (
                                <p className="text-red-500 text-xs mt-2">{formik.errors.newPassword}</p>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name='confirmPassword'
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="pl-10 pr-10 w-full p-3 bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                placeholder="Confirm new password"
                                required
                            />
                            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                                <p className="text-red-500 text-xs mt-2">{formik.errors.confirmPassword}</p>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold p-3 rounded-xl disabled:opacity-50"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;