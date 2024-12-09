import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ChevronRight, EyeOff, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { TutorRegistrationSchema } from '@/services/validation/TutorRegister';
import {  handleRegister } from '@/services/api/register';
import { toast } from 'react-toastify';

const TutorRegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues:{
      first_name: '',
      email:     '',
      phone_number:'',
      password:'',
      confirm_password:'',
      role:'tutor'
    },
    validationSchema: TutorRegistrationSchema,
    onSubmit: async (values) => {
      console.log('valuuuuuuuuesaaaaaaaaanue',values);

      try {
        console.log('valuuuuuuuues',values);
        
        const response = await handleRegister(values)
        formik.resetForm();
        localStorage.setItem('otpExpirationTime', response.otp_expiration);
        localStorage.setItem('session_id',response.session_id)
        toast.success('Enter six digit otp')
        navigate('/otp');

      } catch (error) {
        console.error('Registration Error:', error);
        toast.error('Registration failed',error.message)

      }
    }
  });

  // Animation variants for page and form sections
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 1.05 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const formSectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center p-4"
    >
      <div className="container max-w-4xl mx-auto bg-[#1a1a1a] shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden md:flex flex-col justify-center bg-gradient-to-r from-[#1F2937] to-[#374151] p-12 text-white"
        >
          <div className="space-y-6 text-center">
            <div className="flex justify-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white/20 p-6 rounded-full"
              >
                <User size={64} className="text-white" />
              </motion.div>
            </div>
            <h2 className="text-4xl font-bold text-white">
              Become a Martial Arts Tutor
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Join our platform and help shape the next generation of martial artists. 
              Share your passion, expertise, and inspire students to reach their full potential.
            </p>
          </div>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={formSectionVariants}
          className="p-10 flex flex-col justify-center bg-[#1a1a1a]"
        >
          <motion.h1 
            variants={inputVariants}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500 mb-8 text-center"
          >
            Create Your Tutor Account
          </motion.h1>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <motion.div variants={inputVariants} className="grid md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={18} />
                  <input
                    name="first_name"
                    type="text"
                    className="pl-10 w-full p-3 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.first_name && formik.errors.first_name && (
                  <div className="text-red-400 text-sm mt-1">{formik.errors.first_name}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={18} />
                  <input
                    name="email"
                    type="email"
                    className="pl-10 w-full p-3 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-400 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>
            </motion.div>

            {/* Phone Number */}
            <motion.div variants={inputVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={18} />
                <input
                  name="phone_number"
                  type="tel"
                  className="pl-10 w-full p-3 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 000-0000"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.phone_number && formik.errors.phone_number && (
                <div className="text-red-400 text-sm mt-1">{formik.errors.phone_number}</div>
              )}
            </motion.div>

            {/* Password */}
            <motion.div variants={inputVariants} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={18} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 w-full p-3 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
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
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-400 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={18} />
                  <input
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-10 w-full p-3 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formik.touched.confirm_password && formik.errors.confirm_password && (
                  <div className="text-red-400 text-sm mt-1">{formik.errors.confirm_password}</div>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div 
              variants={inputVariants} 
              className="text-center mt-6"
            >
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black py-3 rounded-lg hover:bg-cyan-500 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
              >
                Register
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </form>

          {/* Sign in link */}
          <motion.div 
            variants={inputVariants}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-400">
              Already have an account? 
              <a href="/login" className="font-medium text-cyan-500 hover:text-cyan-700 hover:underline transition-colors">
                Sign in
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TutorRegistrationPage;    