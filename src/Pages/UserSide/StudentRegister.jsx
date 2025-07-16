import React, { useEffect, useState } from 'react';
import { User, Lock, Mail, Phone, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { handleRegister } from '@/services/api/register';
import { RegisterValidationSchema } from '@/services/validation/Register';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.login);

  useEffect(() => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'tutor') {
      navigate('/tutor/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  const formik = useFormik({
    initialValues: {
      first_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: RegisterValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const response = await handleRegister(values);
        formik.resetForm();
        const expirationTime = Date.now() + 90 * 1000; // 90 seconds
        localStorage.setItem('otpExpirationTime', expirationTime.toString());
        console.log('signupexpiration', response.otp_expiration);

        localStorage.setItem('session_id', response.session_id);
        toast.success('Enter six digit otp');
        navigate('/otp');
      } catch (error) {
        console.error('Api error:', error);
        toast.error('Registration failed');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 font-roboto text-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-5xl bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Image Section */}
        <div className="hidden md:block relative">
          <img
            src="/pexels-cottonbro-4761779.jpg"
            alt="Register Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-transparent opacity-70"></div>
          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-end h-full text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4"
            >
              Join Martial Mastery
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-gray-300"
            >
              Create your account and begin your martial arts journey today.
            </motion.p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Sign Up to Martial Mastery
            </h1>
            {/* Mobile Image Preview (visible only on mobile) */}
            <div className="md:hidden mt-4 mb-6 relative w-full h-32 rounded-xl overflow-hidden">
              <img
                src="/pexels-cottonbro-4761779.jpg"
                alt="Register Background"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-900 to-transparent opacity-70"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-xl font-bold text-white">Begin Your Journey</h3>
              </div>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                <input
                  name="first_name"
                  type="text"
                  className="pl-9 sm:pl-10 w-full p-2.5 sm:p-3 text-sm sm:text-base bg-black border border-zinc-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Enter your username"
                  {...formik.getFieldProps('first_name')}
                />
              </div>
              {formik.touched.first_name && formik.errors.first_name && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.first_name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                <input
                  name="email"
                  type="email"
                  className="pl-9 sm:pl-10 w-full p-2.5 sm:p-3 text-sm sm:text-base bg-black border border-zinc-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Enter your email"
                  {...formik.getFieldProps('email')}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                <input
                  name="phone_number"
                  type="tel"
                  className="pl-9 sm:pl-10 w-full p-2.5 sm:p-3 text-sm sm:text-base bg-black border border-zinc-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="Enter your phone number"
                  {...formik.getFieldProps('phone_number')}
                />
              </div>
              {formik.touched.phone_number && formik.errors.phone_number && (
                <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.phone_number}</div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 sm:pl-10 pr-9 sm:pr-10 w-full p-2.5 sm:p-3 text-sm sm:text-base bg-black border border-zinc-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Enter password"
                    {...formik.getFieldProps('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-9 sm:pl-10 pr-9 sm:pr-10 w-full p-2.5 sm:p-3 text-sm sm:text-base bg-black border border-zinc-700 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="Confirm password"
                    {...formik.getFieldProps('confirm_password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formik.touched.confirm_password && formik.errors.confirm_password && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.confirm_password}</div>
                )}
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold p-2.5 sm:p-3 text-sm sm:text-base rounded-lg sm:rounded-xl mt-4 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending OTP...' : 'Create Account'}
            </motion.button>


            <div className="text-center mt-4 sm:mt-6">
              <p className="text-gray-400 text-sm sm:text-base">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;