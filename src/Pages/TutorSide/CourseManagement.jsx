import React, { useEffect, useState } from 'react';
import TutorSidebar from "@/Components/TutorSidebar";
import TutorTopbar from "@/Components/TutorTopbar";
import {
  BookOpen,
  Video,
  Clock,
  CheckCircle2,
  Play,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Undo,
  Menu
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '@/services/interceptor';
import Modal from '@/Components/Modal/ModalPortal';
import VideoModal from '@/Components/Modal/Videos/VideoModal';
import CourseEditModal from '@/Components/Modal/Courses/EditCourses';
import ConfirmationModal from '@/Components/Modal/Courses/Confirmation';
import { toast } from 'react-toastify';
import StatusConfirmation from '@/Components/Modal/Courses/StatusConfirmation';
import { useTutorSidebar } from '@/Components/TutorSidebarProvider';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [action, setAction] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const [completed, SetCompleted] = useState('');

  const navigate = useNavigate();
  const { role, user } = useSelector((state) => state.login);
  const { isSidebarTutorOpen } = useTutorSidebar();
 
  useEffect(() => {
    if (role !== 'tutor') {
      navigate('/');
    } else {
      fetchCourses();
    }
  }, [role, navigate, action]);

  const fetchCourses = async () => {
    try {
      const tutorId = user?.id;
      const response = await axiosInstance.get(`course/`);
      console.log('here is the data', response.data);
      
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const handleAddCourse = () => {
    navigate('/tutor/add-course');
  };

  const handleAddLesson = (course) => {
    navigate(`/tutor/courses/${course.id}/add-lesson`);
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleDeleteCourse = async (course) => {
    try {
      const response = await axiosInstance.delete(`course/${course.id}/`);
      if (response.status === 200) {
        setCourses(courses.filter(c => c.id !== course.id));
        setShowDeleteModal(false);
      }
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('could not delete course');
    }
  };

  const handleDeleteLesson = async (lesson, courseId) => {
    try {
      const response = await axiosInstance.delete(`course/${courseId}/lesson/${lesson.id}/`);
      if (response.status === 200) {
        const updatedCourses = courses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              tutorials: course.tutorials.filter(t => t.id !== lesson.id)
            };
          }
          return course;
        });
        setCourses(updatedCourses);
        setShowDeleteModal(false);
        toast.success('Lesson Deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Could not delete course');
    }
  };

  const handleUpdateCourse = async (updatedData) => {
    try {
      const response = await axiosInstance.put(
        `course/${courseToEdit.id}/update/`,
        updatedData
      );
      if (response.status === 200) {
        const updatedCourses = courses.map(course =>
          course.id === courseToEdit.id ? { ...course, ...response.data } : course
        );
        setCourses(updatedCourses);
        setShowEditModal(false);
      }
      toast.success("Course Updated successfully");
    } catch (error) {
      toast.error("Failed to update course");
      console.error('Error updating course:', error);
    }
  };

  const handleMarkAsCompleted = async (Id, Mark) => {
    SetCompleted(Mark);
    setIsModalOpen(true);
    setCourseId(Id);
  };  

  const handleConfirmAction = async (Id) => {
    try {
      await axiosInstance.put(`course/${Id}/mark_as_completed/`);
      toast.success('Course marked as completed!');
      setIsModalOpen(false);
      setAction((prev) => !prev);
    } catch (error) {
      toast.error('Failed to mark course as completed');
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar - Fixed position on all screens with transformation for responsive behavior */}
      <div className={`fixed top-0 left-0 h-full w-72 lg:w-80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 z-20 ${
        isSidebarTutorOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <TutorSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:ml-80">
        {/* Topbar */}
        <TutorTopbar />

        {/* Scrollable Content Area */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Course Management</h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">Create and manage your courses and lessons</p>
              </div>
              <button
                onClick={handleAddCourse}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors w-full md:w-auto text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Course
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
              <Card className="bg-white border-gray-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Active Courses</p>
                      <p className="text-lg md:text-2xl font-bold mt-1 text-gray-800">
                        {courses.filter(c => !c.completed).length}
                      </p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Pending Approval</p>
                      <p className="text-lg md:text-2xl font-bold mt-1 text-gray-800">
                        {courses.filter(c => c.completed && c.status === 'pending').length}
                      </p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Approved Courses</p>
                      <p className="text-lg md:text-2xl font-bold mt-1 text-gray-800">
                        {courses.filter(c => c.status === 'approved').length}
                      </p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Courses List */}
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="bg-white border-gray-200">
                  <CardHeader
                    className="cursor-pointer p-4 md:p-6"
                    onClick={() => toggleCourse(course.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-col">
                        <CardTitle className="text-base md:text-lg font-semibold flex flex-wrap items-center gap-2 text-gray-800">
                          {course.title}
                          <span className={`flex items-center px-2 py-1 rounded-full text-xs ${
                            course.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            course.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {getStatusIcon(course.status)}
                            <span className="ml-1">{course.status}</span>
                          </span>
                        </CardTitle>
                        <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                        {!course.completed && course.tutorials?.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsCompleted(course.id, 'Complete');
                            }}
                            className="flex items-center px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm text-green-400 border border-green-400 rounded-lg hover:bg-green-400/10 transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            <span className="hidden xs:inline">Mark Complete</span>
                            <span className="xs:hidden">Complete</span>
                          </button>
                        )}

                        {course.completed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsCompleted(course.id, 'incomplete');
                            }}
                            className="flex items-center px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm text-yellow-400 border border-yellow-400 rounded-lg hover:bg-yellow-400/10 transition-colors"
                          >
                            <Undo className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            <span className="hidden xs:inline">Unmark Complete</span>
                            <span className="xs:hidden">Unmark</span>
                          </button>
                        )}

                        {!course.completed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddLesson(course);
                            }}
                            className="flex items-center px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm text-blue-400 border border-blue-400 rounded-lg hover:bg-blue-400/10 transition-colors"
                          >
                            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                            <span className="hidden xs:inline">Add Lesson</span>
                            <span className="xs:hidden">Add</span>
                          </button>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemToDelete({
                                type: 'course',
                                item: course,
                                courseId: course.id
                              });
                              setShowDeleteModal(true);
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCourseToEdit(course);
                              setShowEditModal(true);
                            }}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <Edit className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          {expandedCourse === course.id ? (
                            <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {expandedCourse === course.id && (
                    <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                      {course.tutorials?.length === 0 ? (
                        <div className="flex items-center justify-center p-4 md:p-6 bg-gray-100 rounded-lg">
                          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mr-2" />
                          <p className="text-sm text-gray-500">No lessons added yet. Add your first lesson to get started.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {course.tutorials?.map((lesson) => (
                            <div key={lesson.id} className="bg-gray-100 rounded-lg overflow-hidden">
                              <div
                                className="relative cursor-pointer"
                                onClick={() => openVideoModal(lesson)}
                              >
                                <img
                                  src={lesson.thumbnail || '/api/placeholder/320/180'}
                                  alt={lesson.title}
                                  className="w-full h-32 sm:h-36 md:h-40 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <Play className="w-8 h-8 md:w-12 md:h-12 text-white" />
                                </div>
                              </div>
                              <div className="p-3 md:p-4">
                                <h3 className="font-medium text-sm md:text-base line-clamp-1 text-gray-800">{lesson.title}</h3>
                                <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2">{lesson.description}</p>
                                {!course.completed && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setItemToDelete({
                                        type: 'lesson',
                                        item: lesson,
                                        courseId: course.id
                                      });
                                      setShowDeleteModal(true);
                                    }}
                                    className="mt-2 md:mt-4 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <Modal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)}>
          <VideoModal
            video={selectedVideo}
            onClose={() => setShowVideoModal(false)}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <ConfirmationModal
            title={`Delete ${itemToDelete?.type === 'course' ? 'Course' : 'Lesson'}`}
            message={`Are you sure you want to delete "${itemToDelete?.item.title}"? This action cannot be undone.`}
            onConfirm={() => {
              if (itemToDelete.type === 'course') {
                handleDeleteCourse(itemToDelete.item);
              } else {
                handleDeleteLesson(itemToDelete.item, itemToDelete.courseId);
              }
            }}
            onCancel={() => setShowDeleteModal(false)}
          />
        </Modal>
      )}

      {/* Edit Course Modal */}
      {showEditModal && courseToEdit && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <CourseEditModal
            course={courseToEdit}
            onSave={handleUpdateCourse}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}

      {/* Status Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <StatusConfirmation
          action={completed}
          handleConfirmAction={() => handleConfirmAction(courseId)}
          closeModal={closeModal}
        />
      </Modal>
    </div>
  );
};

export default CourseManagement;