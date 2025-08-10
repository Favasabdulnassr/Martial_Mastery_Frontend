import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import AdminTopbar from '@/Components/AdminTopbar';
import AdminSidebar from '@/Components/AdminSidebar';
import axiosInstance from '@/services/interceptor';
import { toast } from 'react-toastify';
import Modal from '@/Components/Modal/ModalPortal';
import AdminVideoModal from '@/Components/Modal/Videos/AdminVideoModal';
import StatusConfirmation from '@/Components/Modal/Courses/StatusConfirmation';

const AdminCourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);  // To control modal visibility
    const [action, setAction] = useState(null);  // Store the action (approve/reject)
    const navigate = useNavigate()


    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await axiosInstance.get(`course/${courseId}/completed/`);
            setCourse(response.data);
        } catch (error) {
            toast.error(error);
            
        }
    };

    const openModal = (actionType) => {
        setAction(actionType);  // Set the action type (approve/reject)
        setIsModalOpen(true);  // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false);  // Close the modal
        setAction(null);  // Reset the action
    };

    const handleConfirmAction = async () => {
        if (action) {
            try {
                // Make the request to update course status
                await axiosInstance.put(`course/${course.id}/update_status/`, {
                    status: action,  // Pass the selected action (approve/reject)
                });

                toast.success(`Course ${action}d successfully`);
                navigate('/admin/courses')
                

            } catch (error) {
                console.error(error)
                toast.error(`Failed to ${action} course`);
            }
            closeModal();  // Close the modal after performing the action
        }
    };


    const OpenVideoModal = (video) => {
        setSelectedVideo(video)
        setShowVideoModal(true)
    }


    if (!course) return null;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 lg:ml-80">
                <AdminTopbar />
                <div className="p-6">
                    <div className="bg-white rounded-xl shadow-md">
                        {/* Course Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
                                <div className="flex space-x-2">
                                    {course.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => openModal('approved')}
                                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                <span>Approve</span>
                                            </button>
                                            <button
                                                onClick={() => openModal('rejected')}
                                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                <span>Reject</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Course Details */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Course Information</h3>
                                <div className="space-y-4">
                                    <p><span className="font-medium">Description:</span> {course.description}</p>
                                    <p><span className="font-medium">Duration:</span> {course.duration_weeks} weeks</p>
                                    <p><span className="font-medium">Fees:</span> ${course.fees}</p>
                                    <p><span className="font-medium">Status:</span>
                                        <span className={`ml-2 px-3 py-1 rounded-full text-sm ${course.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                course.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-6">Tutor Information</h3>
                                <div className="space-y-8">
                                    <p><span className="font-medium">Name:</span> {course.tutor.first_name}</p>
                                    <p><span className="font-medium">Name:</span> {course.tutor.email}</p>
                                    <p><span className="font-medium">Name:</span> {course.tutor.phone_number}</p>


                                </div>
                            </div>
                        </div>

                        {/* Lessons List */}
                        <div className="p-6 border-t border-gray-700">
                            <h3 className="text-lg font-semibold mb-4">Course Lessons</h3>
                            <div className="space-y-4">
                                {course.tutorials.map((lesson) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium">{lesson.title}</h4>
                                            <p className="text-sm text-gray-600">{lesson.description}</p>
                                            <p className="text-sm text-gray-600">{lesson.order} video</p>

                                        </div>
                                        <button
                                            onClick={() => OpenVideoModal(lesson)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                                        >
                                            <Play className="w-5 h-5" />
                                            <span>Preview</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showVideoModal && selectedVideo && (
                <Modal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)}>
                    <AdminVideoModal
                        video={selectedVideo}
                        onClose={() => setShowVideoModal(false)}
                    />

                </Modal>

            )}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <StatusConfirmation
                    action={action}
                    handleConfirmAction={handleConfirmAction}  // Pass function to confirm action
                    closeModal={closeModal}  // Pass close function to close modal

                />


            </Modal>



        </div>
    );
};

export default AdminCourseDetail;