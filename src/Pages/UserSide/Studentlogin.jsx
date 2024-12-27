import React, { useEffect, useState } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import {useDispatch, useSelector} from 'react-redux'
import { loginAsync } from '@/Redux/Reducers/LoginReducer';
import { LoginValidationSchema } from '@/services/validation/login';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch()
    const {isAuthenticated,role,error} = useSelector((state)=>state.login)
    const navigate = useNavigate()
  
    useEffect(()=>{
      if(role === 'admin'){
          navigate('/admin/dashboard')
      }
      else if(role === 'tutor'){
        navigate('/tutor/Profile')
      }
      else if (role === 'student') {
        navigate('/profile')
      }
      
  },[isAuthenticated,role,navigate])
  


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginValidationSchema,
        onSubmit: (values) => {

            console.log('Form Submitted:', values); // Add this to debug
            dispatch(loginAsync(values))
            .unwrap()
                .then(() => {
                    toast.success('Login successful!');
                })
                .catch((error) => {
                    console.error(error,'ttttttttttttttttttttttttttoast')
                    toast.error(`Login failed: ${error}`);
                });
        },
    })
    
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full bg-[#1a1a1a] rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl"
            >
                <div className="text-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500"
                    >
                        Welcome Back
                    </motion.h1>
                    <p className="text-gray-300 mt-2">Sign in to access your account</p>
                </div>

                <form className="space-y-5"  onSubmit={formik.handleSubmit}>
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={20} />
                            <input
                                type="email"
                                name='email'
                                className="pl-10 w-full p-3 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={20} />
                            <input
                                name='password'
                                autoComplete='"current-password"'
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10 w-full p-3 bg-black border text-white border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
                            ) : null}
                        </div>
                    </div>

                    {/* Remember me & Forgot password */}
                    {/* <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 border-gray-600 rounded text-cyan-500 focus:ring-cyan-500"
                            />
                            <label className="ml-2 text-sm text-gray-400">Remember me</label>
                        </div>
                        <button className="text-sm text-cyan-500 hover:text-cyan-700 transition-colors">Forgot password?</button>
                    </div> */}

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black p-3 rounded-lg hover:bg-cyan-500 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        Sign In
                        <ArrowRight size={20} />
                    </motion.button>
                </form>

                {/* Sign up link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?
                        <a href="/signup" className="font-medium text-cyan-500 hover:text-cyan-700 hover:underline transition-colors">
                            Sign up
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
