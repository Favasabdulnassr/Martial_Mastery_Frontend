import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import axiosInstance from '@/services/interceptor';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [loadingStates, setLoadingStates] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchCourses = async () => {
      try {

        setIsLoading(true);
        // Add a short delay only when the component mounts
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await axiosInstance.get('users/completed-courses/');
        setCourses(response.data);
      } catch (error) {
        console.log('Error fetching courses:', error);
      } finally {
        setIsLoading(false);

      }
    };

    fetchCourses();
  }, []);

  const handlePayment = async (courseId) => {
    try {
      setLoadingStates(prev => ({ ...prev, [courseId]: true }));

      const response = await axiosInstance.post(`payments/courses/${courseId}/initiate/`);

      if (response.data && response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        toast.error('Unable to initiate payment');
      }
    } catch (error) {
      console.log('Payment error', error);
      toast.info(error.response?.data?.message || 'You have already purchased this course, or an issue has occurred');
    } finally {
      setLoadingStates(prev => ({ ...prev, [courseId]: false }));
    }
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="h-auto md:h-20">
        <Header />
      </div>
      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[20vh] md:min-h-[30vh] bg-[#0a0a0a] px-4"
        >
          <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="block font-light text-zinc-300">Choose Your</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                Martial Arts Journey
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto px-2">
              Explore our diverse range of martial arts courses and find the perfect tutor to guide your path.
            </p>
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-8 sm:py-12 md:py-16 bg-[#0a0a0a]"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Available Courses</h2>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-auto pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
                </div>
              </div>
            </div>

            {/* Display filtered courses */}
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
                      className="p-4 sm:p-6 md:p-8 bg-black rounded-2xl shadow-xl border border-cyan-900/20"
                    >
                      <div className="relative">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{course.title}</h3>
                        <p className="text-zinc-400 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-3">{course.description}</p>
                        <p className="text-zinc-400 mb-3 sm:mb-4 text-sm sm:text-base">
                          <strong>Fees:</strong> {course.fees} USD
                        </p>
                        <p className="text-zinc-400 mb-3 sm:mb-4 text-sm sm:text-base">
                          <strong>Duration:</strong> {course.duration_weeks} weeks
                        </p>
                        <div className="text-violet-400 flex items-center font-semibold mb-4 text-sm sm:text-base">
                          <span className="mr-2">Tutor: {course.tutor.first_name} {course.tutor.last_name || ''}</span>
                        </div>

                        <div className="flex space-x-4">
                          {course.tutorials && (
                            <button
                              onClick={() => handlePayment(course.id)}
                              disabled={loadingStates[course.id]}
                              className="w-full px-4 sm:px-6 py-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition disabled:opacity-50 text-sm sm:text-base"
                            >
                              {loadingStates[course.id] ? 'Processing...' : 'Purchase Now'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center py-10 md:py-20">
                    <p className="text-zinc-400 text-lg">No courses found matching your search</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default CoursesPage;