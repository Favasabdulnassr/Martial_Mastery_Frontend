import React, { useState } from 'react';
import { User, Lock, Mail, Phone, ChevronRight, EyeOff, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { TutorRegistrationSchema } from '@/services/validation/TutorRegister';
import { handleTutorRegister } from '@/services/api/register';
import { toast } from 'react-toastify';

const TutorRegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      first_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      experience: '',
      role: 'tutor'
    },
    validationSchema: TutorRegistrationSchema,
    onSubmit: async (values) => {
      try {
        const response = await handleTutorRegister(values)
        formik.resetForm();
        localStorage.setItem('otpExpirationTime', response.otp_expiration);
        localStorage.setItem('session_id', response.session_id)
        toast.success('Tutor Registered successfully')
        navigate('/login');
      } catch (error) {
        console.error('Registration Error:', error);
        toast.error('Registration failed', error.message)
      }
    }
  });

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
      className="min-h-screen bg-gradient-to-br from-black to-zinc-900 flex items-center justify-center p-4"
    >
      <div className="container max-w-4xl mx-auto bg-zinc-900 shadow-xl rounded-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden md:flex flex-col justify-center bg-gradient-to-r from-black to-zinc-900 p-12 text-white"
        >
          <div className="space-y-6 text-center">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-zinc-800/50 p-6 rounded-full"
              >
                <User size={64} className="text-cyan-400" />
              </motion.div>
            </div>
            <h2 className="text-4xl font-bold text-white">
              Become a Martial Arts Tutor
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
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
          className="p-10 flex flex-col justify-center bg-zinc-900"
        >
          <motion.h1
            variants={inputVariants}
            className="text-3xl font-bold text-white mb-8 text-center"
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
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    name="first_name"
                    type="text"
                    className="pl-10 w-full p-3 text-white bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
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
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    name="email"
                    type="email"
                    className="pl-10 w-full p-3 text-white bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
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

            {/* Experience */}
            <motion.div variants={inputVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Experience (in years)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                <textarea
                  name="experience"
                  className="pl-10 w-full p-3 text-white bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  placeholder="e.g., I have 3 years of experience teaching karate."
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

              </div>
              {formik.touched.experience && formik.errors.experience && (
                <div className="text-red-400 text-sm mt-1">{formik.errors.experience}</div>
              )}
            </motion.div>

            {/* Phone Number */}
            <motion.div variants={inputVariants}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                <input
                  name="phone_number"
                  type="tel"
                  className="pl-10 w-full p-3 text-white bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
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

            {/* Password Fields */}
            <motion.div variants={inputVariants} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 w-full p-3 text-white bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                  <div className="text-red-400 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" size={18} />
                  <input
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-10 w-full p-3 text-white bg-black border border-zinc-700 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="••••••••"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                  <div className="text-red-400 text-sm mt-1">{formik.errors.confirm_password}</div>
                )}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold p-3 rounded-xl flex items-center justify-center gap-2"
            >
              Register
              <ChevronRight size={20} />
            </motion.button>

            {/* Sign in link */}
            <motion.div
              variants={inputVariants}
              className="mt-6 text-center"
            >
              <p className="text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="text-cyan-400 hover:text-cyan-300">
                  Sign in
                </a>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TutorRegistrationPage;