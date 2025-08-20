import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Clock, Award, AlertOctagon } from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import axiosInstance from '@/services/interceptor';
import { useNavigate } from 'react-router-dom';
import Modal from '@/Components/Modal/ModalPortal';
import ReportModal from '@/Components/Modal/ReportModal';
import { toast } from 'react-toastify';

function PurchasedCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedCourseForReport, setSelectedCourseForReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleReportSubmit = async (reportData) => {
    try {
      setIsSubmitting(true);
      await axiosInstance.post('reports/', reportData);
      
      setReportModalOpen(false);
      setSelectedCourseForReport(null);
      
      // Show success notification
      toast.success('Course reported successfully');
    } catch (error) {
      console.error('Error reporting course:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
      setReportModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        setIsLoading(true);
        // Add a short delay only when the component mounts
       await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await axiosInstance.get('payments/courses/');
        setPurchasedCourses(response.data);
      } catch (error) {
        console.error('Error fetching purchased courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  const filteredCourses = purchasedCourses.filter(course =>
    course.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.course_description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWatchTutorial = (courseId, tutorId) => {
    navigate(`/tutorials/${courseId}/list/${tutorId}`);
  };

  const openReportModal = (course) => {
    setSelectedCourseForReport(course);
    setReportModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="h-auto md:h-20">
        <Header />
      </div>
      <main className="flex-1">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[15vh] sm:min-h-[20vh] bg-[#0a0a0a]"
        >
          <div className="container mx-auto px-4 py-8 sm:py-12 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
              <span className="block font-light text-zinc-300">Your Learning</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                Journey Continues
              </span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto px-2">
              Track your progress and continue learning from your purchased courses
            </p>
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-8 sm:py-12 md:py-16 bg-[#0a0a0a]"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">My Courses</h2>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search my courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-auto pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-10 md:py-20">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 sm:p-6 bg-black rounded-2xl shadow-xl border border-cyan-900/20 relative"
                    >
                      <div className="flex justify-end items-center gap-2 mb-4 sm:mb-6 text-white">
                        <span className="text-zinc-300 text-xs sm:text-sm">Report</span>
                        <button
                          onClick={() => openReportModal(course)}
                          className="text-zinc-400 hover:text-red-500 transition-colors duration-200"
                          aria-label="Report course"
                        >
                          <AlertOctagon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      <div className="relative">
                        <div className="mb-3 sm:mb-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">{course.course_title}</h3>
                          <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{course.course_description}</p>
                        </div>

                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                          <div className="flex items-center text-zinc-400 text-xs sm:text-sm">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span>{course.course_duration} weeks duration</span>
                          </div>
                          <div className="flex items-center text-zinc-400 text-xs sm:text-sm">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            <span>Tutor: {course.tutor_name}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs sm:text-sm text-zinc-400 mb-1">
                            <span>Progress</span>
                            <span>{course.progress || 0}%</span>
                          </div>
                          <div className="w-full h-1.5 sm:h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                              style={{ width: `${course.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleWatchTutorial(course.id, course.tutor_id)}
                          className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white rounded-full hover:shadow-[0_0_20px_rgba(79,236,255,0.3)] transition-all duration-300 text-sm sm:text-base"
                        >
                          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Start Learning</span>
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center py-10 md:py-20">
                    <p className="text-zinc-400 text-lg">No purchased courses found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {reportModalOpen && (
        <Modal isOpen={reportModalOpen} onClose={() => !isSubmitting && setReportModalOpen(false)}>
          <ReportModal
            course={selectedCourseForReport}
            onClose={() => !isSubmitting && setReportModalOpen(false)}
            onSubmit={handleReportSubmit}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}
      
      <Footer />
    </div>
  );
}

export default PurchasedCoursesPage;