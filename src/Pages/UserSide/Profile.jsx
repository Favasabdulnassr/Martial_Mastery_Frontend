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
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const {isAuthenticated, is_superuser, first_name, is_tutor, phone_number, email} = useSelector((state)=> state.login)
  const navigate = useNavigate()
  
  const slideInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  useEffect(()=>{
    if(isAuthenticated && !is_superuser && !is_tutor){
      
    }else{
      navigate('/login')
    }
  },[isAuthenticated,is_superuser,is_tutor])

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
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-violet-500/20">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Shield className="w-12 h-12 text-cyan-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                  <Camera className="w-5 h-5 text-black" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">John Doe</h1>
                <p className="text-zinc-400 mb-4">Martial Arts Enthusiast • Member since 2024</p>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300"
                  >
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-[#1a1a1a] text-white rounded-full hover:bg-[#222] transition-all duration-300"
                  >
                    View Public Profile
                  </motion.button>
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
                        placeholder={first_name ? first_name : "Enter your first name"}
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                        placeholder={email ? email : "Enter your email"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                        placeholder={phone_number ? phone_number : "Enter your phone number"}
                      />
                    </div>
                  </div>
                  
                  <motion.button
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
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-3 bg-black border border-zinc-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      placeholder="Confirm new password"
                    />
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