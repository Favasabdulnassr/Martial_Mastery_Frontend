import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    Save,
    Shield,
    Settings,
    Lock,
    Users,
    BookOpen,
    Clipboard
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

    const { isAuthenticated, first_name, last_name, role, phone_number, email, profile,bio,experience } = useSelector((state) => state.login);
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
    }, [isAuthenticated, first_name, last_name, email, phone_number, dispatch, profile,experience,bio]);

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

    // const tutorStats = [
    //     {
    //         icon: <Users className="w-6 h-6 text-blue-400" />,
    //         label: 'Total Students',
    //         value: '45'
    //     },
    //     {
    //         icon: <BookOpen className="w-6 h-6 text-blue-400" />,
    //         label: 'Active Courses',
    //         value: '6'
    //     },
    //     {
    //         icon: <Clipboard className="w-6 h-6 text-blue-400" />,
    //         label: 'Completed Assignments',
    //         value: '22'
    //     }
    // ];

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
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            <TutorSidebar />

            <div className="flex-1 lg:ml-80">
                <TutorTopbar />

                <div className="container mx-auto px-4 py-8">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700"
                    >
                        <div className="relative flex flex-col md:flex-row items-center gap-8">
                            {/* Profile Image */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
                                    {profile ? (
                                        <img
                                            src={`http://127.0.0.1:8000/${profile}`}
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
                                            <Shield className="w-12 h-12 text-blue-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Camera Upload Button */}
                                {!profile && (
                                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all duration-300">
                                        <Camera className="w-5 h-5 text-white" />
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

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-white mb-2">{firstName}</h1>
                                <p className="text-zinc-400 mb-4">Martial Arts Enthusiast • Member since 2024</p>
                                <div className="flex flex-wrap gap-4">
                                    {!profile ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full shadow-lg shadow-cyan-500/25 transition-all duration-300"
                                            onClick={handleUploadImage}
                                        >
                                            Upload New Image
                                        </motion.button>
                                    ) : (
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

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-white mb-2">{firstName}</h1>
                                <p className="text-gray-400 mb-4">Professional Tutor • Martial Arts Specialist</p>

                                {/* Tutor Stats */}
                                {/* <div className="flex justify-center md:justify-start space-x-6 mt-4">
                                    {tutorStats.map((stat, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            {stat.icon}
                                            <div>
                                                <p className="text-sm text-gray-400">{stat.label}</p>
                                                <p className="text-xl font-bold text-white">{stat.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div> */}
                            </div>
                        </div>
                    </motion.div>

                    {/* Profile Content */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left and Middle Columns - Account Settings and Password */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="md:col-span-2 space-y-8"
                        >
                            {/* Personal Information */}
                            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <Settings className="w-6 h-6 mr-2 text-blue-400" />
                                    Account Settings
                                </h2>
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                                placeholder="Enter your first name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                                placeholder="Enter your last name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                                placeholder="Enter your phone number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Experience
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                                placeholder="Brief description of your experience"
                                                value={Experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                Professional Bio
                                            </label>
                                            <textarea
                                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
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
                                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                </form>
                            </div>

                            {/* Change Password Section */}
                            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <Lock className="w-6 h-6 mr-2 text-blue-400" />
                                    Change Password
                                </h2>
                                <form className="space-y-6" onSubmit={formik.handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name='current_password'
                                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
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
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name='new_password'
                                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
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
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name='confirm_password'
                                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                            placeholder="Confirm new password"
                                            value={formik.values.confirm_password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                         {formik.touched.confirm_password && formik.errors.confirm_password && (
                      <div className="text-red-500 text-sm">{formik.errors.confirm_password}</div>
                    )}
                                    </div>
                                    <button
                                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Update Password
                                    </button>
                                </form>
                            </div>
                        </motion.div>




                    </div>
                </div>
            </div>
        </div>
    )


}


export default TutorProfilePage