import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    Save,
    Shield,
    Settings,
    Lock,
    Users,
} from 'lucide-react';
import { BASE_URL } from '@/services/constents';
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

    const { isAuthenticated, first_name, last_name, role, phone_number, email, profile, bio, experience, google_login } = useSelector((state) => state.login);
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

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            {/* Sidebar */}
            <TutorSidebar />

            {/* Main Content */}
            <div className="flex-1 lg:ml-80">
                <TutorTopbar />

                <div className="p-4 sm:p-6 space-y-6">
                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Your Profile</h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your personal information and account settings</p>
                    </div>

                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm"
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-200">
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
                                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-all duration-300">
                                        <Camera className="w-4 h-4 text-white" />
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

                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{firstName} {lastName}</h1>
                                <p className="text-gray-500 mb-4">Professional Tutor</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                                    {!profile ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg shadow transition-all duration-300 text-sm"
                                            onClick={handleUploadImage}
                                        >
                                            Upload New Image
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            onClick={handleDeleteImage}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg shadow transition-all duration-300 text-sm"
                                        >
                                            Delete Image
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Profile Content - Responsive Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Account Settings */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm"
                            >
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Settings className="w-5 h-5 mr-2 text-gray-500" />
                                    Account Settings
                                </h2>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm"
                                                placeholder="Enter your first name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm"
                                                placeholder="Enter your last name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm"
                                                placeholder="Enter your phone number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Experience
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm"
                                                placeholder="Brief description of your experience"
                                                value={Experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                Professional Bio
                                            </label>
                                            <textarea
                                                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm"
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
                                        className="w-full px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </form>
                            </motion.div>

                            {/* Password Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm"
                            >
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Lock className="w-5 h-5 mr-2 text-gray-500" />
                                    Change Password
                                </h2>
                                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm"
                                            placeholder="Enter current password"
                                            value={formik.values.current_password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.current_password && formik.errors.current_password && (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.current_password}</div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm"
                                            placeholder="Enter new password"
                                            value={formik.values.new_password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.new_password && formik.errors.new_password && (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.new_password}</div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm"
                                            placeholder="Confirm new password"
                                            value={formik.values.confirm_password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.confirm_password && formik.errors.confirm_password && (
                                            <div className="text-red-500 text-xs mt-1">{formik.errors.confirm_password}</div>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Save className="w-4 h-4" />
                                        Update Password
                                    </button>
                                </form>
                            </motion.div>
                        </div>

                        {/* Right column */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm h-full"
                            >
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                                    Profile Overview
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-100 rounded-lg">
                                        <h3 className="font-medium text-gray-600 mb-2">Quick Tips</h3>
                                        <ul className="list-disc list-inside text-sm space-y-2 text-gray-600">
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
    );
};

export default TutorProfilePage;