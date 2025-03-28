import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Save,
  LogOut,
  Shield,
  Settings,
  Lock,
  MessageSquare
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
      console.log('kkkkkkkkkkkkkkkk')
      const data = {
        first_name: firstName,
        last_name: lastName,
        email: Email,
        phone_number: phoneNumber

      }
      dispatch(updateProfileAsync(data))
        .unwrap()
        .then(() => {
          toast.success('profile update successfully');
        })
        .catch((error) => {
          toast.error('Error updating profile', error)
        })


    } catch (error) {

      console.log('errrrrrrrrrrrror', error)

    }
  }



  const handleUploadImage = () => {
    if (profileImage) {
      console.log('profileImagedududududud:', profileImage)
      const formData = new FormData();
      console.log(formData, 'ffffffffffffffffffff');


      formData.append('profile', profileImage); // Use append method to add file to FormData
      console.log('afterappend formdata:', formData)

      dispatch(UploadImage(formData)).unwrap().then(() => {
        // Optional: You can fetch updated user profile or image after successful upload
        navigate("/profile")
        setPreviewImage(null)
        toast.success('image uploaded')
      }).catch((error) => {
        toast.error(error)
        console.error('Error uploading image:', error);
        // Handle error state or show toast/message to user
      });
    }
  };


  const handleDeleteImage = () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this image?");

    if (isConfirmed) {
      // If the user confirmed, proceed with the deletion
      dispatch(DeleteImage());
      setPreviewImage(null);
      toast.success("Image Deleted Successfully");
      navigate("/profile");
    } else {
      // If the user canceled, do nothing
      toast.info("Image deletion canceled");
    }
  };


  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',  // Added confirm_password
    },
    validationSchema: PasswordValidationSchema,
    onSubmit: async (values) => {
      try {
        const { current_password, new_password, confirm_password } = values;

        const response = await axiosInstance.post('/auth/change_password/', {
          current_password,
          new_password,
          confirm_password,  // Send confirm_password to backend
        });

        if (response.data.success) {
          toast.success('Password changed successfully!');
          formik.resetForm();  // Reset form after successful submission
          navigate('/profile');  // Redirect to profile or another page
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

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Profile Header Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative bg-[#0a0a0a] rounded-2xl p-8 mb-8 border border-zinc-900"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-violet-500/10 rounded-2xl opacity-20" />

            <div className="relative flex flex-col md:flex-row items-start gap-8">
              {/* Profile Image */}
              {/* Profile Image Section */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-violet-500/20">
                  {profile ? (
                    google_login ? (
                      <img
                        src={profile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={`http://127.0.0.1:8000${profile}`}
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
                      <Shield className="w-12 h-12 text-cyan-400" />
                    </div>
                  )}
                </div>

                {/* Camera Upload Button */}
                {!profile && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                    <Camera className="w-5 h-5 text-black" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewImage(URL.createObjectURL(file));
                          setProfileImage(file)
                          console.log(previewImage)
                        }
                      }}
                    />
                  </label>
                )}
              </div>


              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{firstName}</h1>
                <p className="text-zinc-400 mb-4">Martial Arts Enthusiast • Member since 2024</p>
                <div className="flex flex-wrap gap-4">
                  {!profile ? (
                    // If profileImage exists, show the "Upload" button
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300"
                      onClick={handleUploadImage}
                    >
                      Upload New Image
                    </motion.button>
                  ) : (
                    // If profileImage does not exist, show the "Delete" button
                    <motion.button
                      onClick={handleDeleteImage}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-full shadow-lg shadow-red-500/25 transition-all duration-300"
                    >
                      Delete Image
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Account Settings */}
            <motion.div
              variants={slideInUp}
              initial="initial"
              animate="animate"
              className="md:col-span-2 space-y-8"
            >
              {/* Personal Information */}
              <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-zinc-900">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-cyan-400" />
                  Account Settings
                </h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                        placeholder="Enter your first name"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                        placeholder="Enter your last name"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={Email}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                        placeholder="Enter your phone number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                      />
                    </div>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default form submission behavior
                      ProfileUpdate()
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </motion.button>
                </form>
              </div>

              {/* Change Password Section */}
              <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-zinc-900">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Lock className="w-6 h-6 mr-2 text-cyan-400" />
                  Change Password
                </h2>
                <form className="space-y-6" onSubmit={formik.handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name='current_password'
                      className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      placeholder="Enter current password"
                      value={formik.values.current_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.current_password && formik.errors.current_password && (
                      <div className="text-red-500 text-sm">{formik.errors.current_password}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name='new_password'
                      className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      placeholder="Enter new password"
                      value={formik.values.new_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.new_password && formik.errors.new_password && (
                      <div className="text-red-500 text-sm">{formik.errors.new_password}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name='confirm_password'
                      className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      placeholder="Confirm new password"
                      value={formik.values.confirm_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.confirm_password && formik.errors.confirm_password && (
                      <div className="text-red-500 text-sm">{formik.errors.confirm_password}</div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Update Password
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Right Column - Last Class Feedback */}
            <motion.div
              variants={slideInUp}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              {/* Last Class Feedback */}
              <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-zinc-900">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-fuchsia-400" />
                  Last Class Feedback
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-black rounded-lg border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-400">Basic Form Training</span>
                      <span className="text-sm text-zinc-600">March 15, 2024</span>
                    </div>
                    <p className="text-zinc-400 text-sm">
                      Excellent progress on stance transitions. Focus needed on breathing techniques during complex movements. Overall performance: 8/10
                    </p>
                  </div>
                  <div className="p-4 bg-black rounded-lg border border-zinc-800">
                    <h3 className="text-white text-sm font-medium mb-2">Instructor Notes:</h3>
                    <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1">
                      <li>Maintain better balance during high kicks</li>
                      <li>Great improvement in form precision</li>
                      <li>Continue practicing breathing exercises</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full shadow-lg shadow-red-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
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