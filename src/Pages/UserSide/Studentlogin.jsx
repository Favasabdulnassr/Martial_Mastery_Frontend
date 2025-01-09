import React, { useEffect, useState } from 'react';
import { Lock, Mail, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux'
import { loginAsync } from '@/Redux/Reducers/LoginReducer';
import { LoginValidationSchema } from '@/services/validation/login';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import { handleGoogleSuccess } from '@/Redux/Actions/GoogleLogin';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
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
            email: '',
            password: '',
        },
        validationSchema: LoginValidationSchema,
        onSubmit: (values) => {
            dispatch(loginAsync(values))
                .unwrap()
                .then(() => {
                    toast.success('Login successful!');
                })
                .catch((error) => {
                    toast.error(`Login failed: ${error}`);
                });
        },
    });

    const handleGoogleLoginSuccess = async (response) => {
        try {
            await dispatch(handleGoogleSuccess(response)).unwrap();
            toast.success('Google login successful');
            navigate('/tutor/Profile');
        } catch (error) {
            toast.error(error?.message || 'Google login failed');
        }
    };

    const Signin = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => toast.error('Google login failed'),
        flow: 'auth-code',
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 font-poppins text-gray-100 flex items-center justify-center p-6 lg:p-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-full max-w-5xl bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
            >
                {/* Image Section */}
                <div className="hidden md:block relative">
                    <img
                        src="/pexels-cottonbro-4761779.jpg"
                        alt="Login Background"
                        className="absolute inset-0 w-full h-full object-fill"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-transparent opacity-70"></div>
                    <div className="relative z-10 p-10 flex flex-col justify-end h-full text-white">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl font-bold mb-4"
                        >
                            Welcome Back
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-gray-300"
                        >
                            Sign in to continue your martial arts journey.
                        </motion.p>
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-10">

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
                                <input
                                    name="email"
                                    type="email"
                                    className="pl-10 w-full p-3 bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                    placeholder="Enter your email"
                                    {...formik.getFieldProps('email')}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={20} />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="pl-10 pr-10 w-full p-3 bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                                    placeholder="Enter your password"
                                    {...formik.getFieldProps('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            )}

                            <div className="text-right">
                                <p className="text-cyan-400 hover:text-cyan-300 text-sm">
                                    <Link to={'/forgotPassword'}>Forgot Password?</Link>
                                </p>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold p-3 rounded-xl"
                        >
                            Sign In
                        </motion.button>

                        <div className="text-center mt-6">
                            <p className="text-gray-400">
                                Don't have an account?{' '}
                                <a href="/signup" className="text-cyan-400 hover:text-cyan-300">
                                    Sign up
                                </a>
                            </p>
                        </div>

                    </form>

                    <div className="text-center py-4">


                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full mb-4 flex items-center justify-center bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 space-x-3"
                            onClick={Signin}
                        >
                            <svg className="sm:size-6 size-5" xmlns="http://www.w3.org/2000/svg" width="40" height="80" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                            </svg>
                            Sign in with Google
                        </motion.button>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;