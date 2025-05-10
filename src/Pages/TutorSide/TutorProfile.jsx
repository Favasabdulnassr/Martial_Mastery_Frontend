import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    Save,
    Shield,
    Settings,
    Lock,
    Users,
    Menu
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/Redux/Reducers/LoginReducer';
import { updateProfileAsync } from '@/Redux/Actions/UpdateAction';
import { toast } from 'react-toastify';
import { DeleteImage, UploadImage } from '@/Redux/Actions/imageAction';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import { useFormik } from 'formik';
import { TutorPasswordValidationSchema } from '@/services/validation/TutorPassword';
import axiosInstance from '@/services/interceptor';

const TutorProfilePage = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [Experience, setExperience] = useState('');
    const [Bio, setBio] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { isAuthenticated, first_name, last_name, role, phone_number, email, profile, bio, experience } = useSelector((state) => state.login);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated && role === 'tutor') {
            setFirstName(first_name);
            setLastName(last_name);
            setEmail(email);
            setPhoneNumber(phone_number);
            setExperience(experience);
            setBio(bio)
        }
        else {
            dispatch(logout())
            navigate('/login');
        }
    }, [isAuthenticated, first_name, last_name, email, phone_number, dispatch, profile, experience, bio, role, navigate]);

    const ProfileUpdate = () => {
        try {
            const data = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone_number: phoneNumber,
                experience: Experience,
                bio: Bio
            };

            dispatch(updateProfileAsync(data))
                .unwrap()
                .then(() => {
                    toast.success('Profile updated successfully');
                })
                .catch((error) => {
                    toast.error('Error updating profile', error);
                });
        } catch (error) {
            console.error('Error updating profile', error);
        }
    };

    const handleUploadImage = () => {
        if (profileImage) {
            const formData = new FormData();
            formData.append('profile', profileImage);

            dispatch(UploadImage(formData))
                .unwrap()
                .then(() => {
                    navigate("/tutor/profile");
                    setPreviewImage(null);
                    toast.success('Image uploaded');
                })
                .catch((error) => {
                    toast.error('Error uploading image');
                    console.error('Error uploading image:', error);
                });
        }
    };

    const handleDeleteImage = () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this image?");

        if (isConfirmed) {
            dispatch(DeleteImage());
            setPreviewImage(null);
            toast.success("Image Deleted Successfully");
            navigate("/tutor/profile");
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
        validationSchema: TutorPasswordValidationSchema,
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
                    navigate('/tutor/Profile');
                } else {
                    toast.error('Password change failed');
                }
            } catch (error) {
                console.error('API error:', error);
                toast.error('An error occurred while changing password');
            }
        },
    });

    // Completely redesigned layout
    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar - visible on medium screens and up */}
            <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 bg-gray-800 h-full overflow-y-auto">
                <TutorSidebar />
            </aside>

            {/* Main content area - always full width on mobile, adjusted width on larger screens */}
            <div className="flex flex-col flex-grow w-full md:w-[calc(100%-16rem)] lg:w-[calc(100%-18rem)] overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-gray-800 p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Tutor Dashboard</h1>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-gray-800 border-b border-gray-700 p-4">
                        <TutorSidebar />
                    </div>
                )}

                {/* Desktop Header */}
                <div className="hidden md:block">
                    <TutorTopbar />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-grow overflow-y-auto p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Profile Header */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="bg-gray-800 rounded-2xl p-4 sm:p-6 mb-6 border border-gray-700"
                        >
                            <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-8">
                                {/* Profile Image */}
                                <div className="relative mb-4 md:mb-0">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-700">
                                        {profile ? (
                                            <img
                                                src={`http://127.0.0.1:8000${profile}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Shield className="w-10 h-10 md:w-12 md:h-12 text-blue-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Camera Upload Button */}
                                    {!profile && (
                                        <label className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all duration-300">
                                            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setPreviewImage(URL.createObjectURL(file));
                                                        setProfileImage(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{firstName}</h1>
                                    <p className="text-zinc-400 mb-4">Professional Tutor</p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        {!profile ? (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300 text-sm sm:text-base"
                                                onClick={handleUploadImage}
                                            >
                                                Upload New Image
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                onClick={handleDeleteImage}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-full shadow-lg shadow-red-500/25 transition-all duration-300 text-sm sm:text-base"
                                            >
                                                Delete Image
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Profile Content - New responsive grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Account Settings - Takes 2/3 space on large screens */}
                            <div className="xl:col-span-2 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700"
                                >
                                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
                                        <Settings className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-400" />
                                        Account Settings
                                    </h2>
                                    <form className="space-y-4 md:space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base"
                                                    placeholder="Enter your first name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base"
                                                    placeholder="Enter your last name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className="w-full p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base"
                                                    placeholder="Enter your email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="w-full p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base"
                                                    placeholder="Enter your phone number"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">
                                                    Experience
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base"
                                                    placeholder="Brief description of your experience"
                                                    value={Experience}
                                                    onChange={(e) => setExperience(e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">
                                                    Professional Bio
                                                </label>
                                                <textarea
                                                    className="w-full p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base"
                                                    rows={4}
                                                    placeholder="Tell us about your professional background and teaching philosophy"
                                                    value={Bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                ProfileUpdate();
                                            }}
                                            className="w-full px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <Save className="w-4 h-4 md:w-5 md:h-5" />
                                            Save Changes
                                        </button>
                                    </form>
                                </motion.div>

                                {/* Password Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700"
                                >
                                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
                                        <Lock className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-400" />
                                        Change Password
                                    </h2>
                                    <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                name='current_password'
                                                className="w-full p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base"
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
                                            <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                name='new_password'
                                                className="w-full p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base"
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
                                            <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                name='confirm_password'
                                                className="w-full p-2 md:p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-base"
                                                placeholder="Confirm new password"
                                                value={formik.values.confirm_password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.confirm_password && formik.errors.confirm_password && (
                                                <div className="text-red-500 text-xs md:text-sm mt-1">{formik.errors.confirm_password}</div>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <Save className="w-4 h-4 md:w-5 md:h-5" />
                                            Update Password
                                        </button>
                                    </form>
                                </motion.div>
                            </div>

                            {/* Right column - Takes 1/3 space on large screens */}
                            <div className="xl:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 h-full"
                                >
                                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center">
                                        <Users className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-400" />
                                        Profile Overview
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-700 rounded-lg">
                                            <h3 className="font-medium text-blue-400 mb-2">Quick Tips</h3>
                                            <ul className="list-disc list-inside text-sm space-y-2 text-gray-300">
                                                <li>Keep your profile updated to attract more students</li>
                                                <li>A professional photo increases student trust</li>
                                                <li>Detailed experience helps showcase your expertise</li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorProfilePage;