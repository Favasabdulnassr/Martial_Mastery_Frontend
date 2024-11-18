  import React, { useState } from 'react';
  import { User, Lock, Mail, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
  import { motion } from 'framer-motion';
  import { useNavigate } from 'react-router-dom';
  import { BASE_URL } from '@/services/constents';
  import { useFormik } from 'formik';
  import { handleRegister } from '@/services/api/auth';
  import { RegisterValidationSchema } from '@/services/validation/Register';
import { toast } from 'react-toastify';

  const SignupPage = () => {
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
      },
      validationSchema:RegisterValidationSchema,
      onSubmit:async(values) => {
        console.log('form_values',values)
        try {
          const response = await handleRegister(values);
          console.log('Api Response',response);
          formik.resetForm();
          toast.success('students registered successfully')
          navigate('/login')

        } catch (error) {
          console.error('Api error:',error,error.message)
          toast.error('Registration failed',error.message)
          
        }
      } 
    }

    )

  


  

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
              Join Us
            </motion.h1>
            <p className="text-gray-300 mt-2">Create your account to get started</p>
          </div>

          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={20} />
                <input
                  name="first_name" // Add this line
                  type="text"
                  className="pl-10 w-full p-2 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                  placeholder="johndoe"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.first_name && formik.errors.first_name && (
              <div className="error text-red-600">{formik.errors.first_name}</div>
            )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={20} />
                <input
                  name='email'
                  type="email"
                  className="pl-10 w-full p-2 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}

                />
              </div>
              {formik.touched.email && formik.errors.email && (
              <div className="error text-red-600">{formik.errors.email}</div>
            )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={20} />
                <input
                  name='phone_number'
                  type="tel"
                  className="pl-10 w-full p-2 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                  placeholder="+1 (555) 000-0000"
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.phone_number && formik.errors.phone_number && (
              <div className="error text-red-600">{formik.errors.phone_number}</div>
            )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={20} />
                <input
                  name='password'
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 w-full p-2 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
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
              </div>
              {formik.touched.password && formik.errors.password && (
              <div className="error text-red-600">{formik.errors.password}</div>
            )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" size={20} />
                <input
                  name='confirm_password'
                  type={showConfirmPassword ? "text" : "password"}
                  className="pl-10 pr-10 w-full p-2 text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
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
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.confirm_password && formik.errors.confirm_password && (
              <div className="error text-red-600">{formik.errors.confirm_password}</div>
            )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black p-3 rounded-lg hover:bg-cyan-500 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Sign Up
              <ArrowRight size={20} />
            </motion.button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account? 
              <a href="/login" className="font-medium text-cyan-500 hover:text-cyan-700 hover:underline transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    );
  };

  export default SignupPage;



