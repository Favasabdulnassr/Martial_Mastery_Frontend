import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Save,
  LogOut,
  Shield,
  Settings,
  Lock
} from 'lucide-react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/Redux/Reducers/LoginReducer';
import { useFormik } from 'formik';
import { updateProfileAsync } from '@/Redux/Actions/UpdateAction';
import { toast } from 'react-toastify';
import { DeleteImage, UploadImage } from '@/Redux/Actions/imageAction';
import { BASE_URL } from '@/services/constents';
import { PasswordValidationSchema } from '@/services/validation/Password';
import axiosInstance from '@/services/interceptor';

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { isAuthenticated, first_name, role, phone_number, email, last_name, profile, google_login } = useSelector((state) => state.login)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Successfully logged out')
  }

  const slideInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  useEffect(() => {
    if (isAuthenticated && role === 'student') {
      setFirstName(first_name);
      setLastName(last_name);
      setEmail(email);
      setPhoneNumber(phone_number);
    }
    else {
      dispatch(logout())
      navigate('/login');
    }
  }, [isAuthenticated, first_name, last_name, email, phone_number, dispatch, profile]);

  const ProfileUpdate = () => {
    try {
      const data = {
        first_name: firstName,
        last_name: lastName,
        email: Email,
        phone_number: phoneNumber
      }
      dispatch(updateProfileAsync(data))
        .unwrap()
        .then(() => {
          toast.success('Profile updated successfully');
        })
        .catch((error) => {
          toast.error('Error updating profile', error)
        })
    } catch (error) {
      console.log('Error:', error)
    }
  }

  const handleUploadImage = () => {
    if (profileImage) {
      const formData = new FormData();
      formData.append('profile', profileImage);

      dispatch(UploadImage(formData)).unwrap().then(() => {
        navigate("/profile")
        setPreviewImage(null)
        toast.success('Image uploaded successfully')
      }).catch((error) => {
        toast.error(error)
        console.error('Error uploading image:', error);
      });
    }
  };

  const handleDeleteImage = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this image?");

    if (isConfirmed) {
      dispatch(DeleteImage());
      setPreviewImage(null);
      toast.success("Image deleted successfully");
      navigate("/profile");
    } else {
      toast.info("Image deletion canceled");
    }
  };

  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: PasswordValidationSchema,
    onSubmit: async (values) => {
      try {
        const { current_password, new_password, confirm_password } = values;

        const response = await axiosInstance.post('/auth/change_password/', {
          current_password,
          new_password,
          confirm_password,
        });

        if (response.data.success) {
          toast.success('Password changed successfully!');
          formik.resetForm();
          navigate('/profile');
        } else {
          toast.error('Password change failed');
        }
      } catch (error) {
        console.error('API error:', error);
        toast.error('An error occurred while changing password');
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-1 pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6 md:py-12">
          {/* Profile Header Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative bg-[#0a0a0a] rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 md:mb-8 border border-zinc-900"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-violet-500/10 rounded-xl md:rounded-2xl opacity-20" />

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-8">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-violet-500/20">
                  {profile ? (
                    google_login ? (
                      <img
                        src={profile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`${BASE_URL}${profile}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Shield className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />
                    </div>
                  )}
                </div>

                {/* Camera Upload Button */}
                {!profile && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                    <Camera className="w-4 h-4 md:w-5 md:h-5 text-black" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewImage(URL.createObjectURL(file));
                          setProfileImage(file)
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">{firstName}</h1>
                <p className="text-zinc-400 text-sm md:text-base mb-3 md:mb-4">Martial Arts Enthusiast • Member since 2024</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-4">
                  {!profile ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 md:px-6 py-1.5 md:py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black text-sm md:text-base font-semibold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300"
                      onClick={handleUploadImage}
                    >
                      Upload New Image
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={handleDeleteImage}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 md:px-6 py-1.5 md:py-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm md:text-base font-semibold rounded-full shadow-lg shadow-red-500/25 transition-all duration-300"
                    >
                      Delete Image
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {/* Left Column - Account Settings */}
            <motion.div
              variants={slideInUp}
              initial="initial"
              animate="animate"
              className="lg:col-span-3 space-y-4 md:space-y-6 lg:space-y-8"
            >
              {/* Personal Information */}
              <div className="bg-[#0a0a0a] rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-zinc-900">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
                  <Settings className="w-5 h-5 md:w-6 md:h-6 mr-2 text-cyan-400" />
                  Account Settings
                </h2>
                <form className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1 md:mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 md:p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white text-sm md:text-base"
                        placeholder="Enter your first name"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1 md:mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 md:p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white text-sm md:text-base"
                        placeholder="Enter your last name"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1 md:mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 md:p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white text-sm md:text-base"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={Email}
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1 md:mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-2 md:p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white text-sm md:text-base"
                        placeholder="Enter your phone number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                      />
                    </div>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      ProfileUpdate()
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black text-sm md:text-base font-semibold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4 md:w-5 md:h-5" />
                    Save Changes
                  </motion.button>
                </form>
              </div>

              {/* Change Password Section */}
              <div className="bg-[#0a0a0a] rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-zinc-900">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
                  <Lock className="w-5 h-5 md:w-6 md:h-6 mr-2 text-cyan-400" />
                  Change Password
                </h2>
                <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1 md:mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name='current_password'
                      className="w-full p-2 md:p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white text-sm md:text-base"
                      placeholder="Enter current password"
                      value={formik.values.current_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.current_password && formik.errors.current_password && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{formik.errors.current_password}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1 md:mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name='new_password'
                      className="w-full p-2 md:p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white text-sm md:text-base"
                      placeholder="Enter new password"
                      value={formik.values.new_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.new_password && formik.errors.new_password && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{formik.errors.new_password}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1 md:mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name='confirm_password'
                      className="w-full p-2 md:p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white text-sm md:text-base"
                      placeholder="Confirm new password"
                      value={formik.values.confirm_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.confirm_password && formik.errors.confirm_password && (
                      <div className="text-red-500 text-xs md:text-sm mt-1">{formik.errors.confirm_password}</div>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black text-sm md:text-base font-semibold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4 md:w-5 md:h-5" />
                    Update Password
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Right Column - Logout Button */}
            <motion.div
              variants={slideInUp}
              initial="initial"
              animate="animate"
              className="lg:col-span-1 flex flex-col justify-start"
            >
              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm md:text-base font-semibold rounded-full shadow-lg shadow-red-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                Logout
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;