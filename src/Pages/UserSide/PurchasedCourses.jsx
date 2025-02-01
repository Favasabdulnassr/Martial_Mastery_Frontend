import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Clock, Award } from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import axiosInstance from '@/services/interceptor';
import { useNavigate } from 'react-router-dom';

function PurchasedCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('payment/purchased-courses/');
        console.log('kittttt',response.data);
        
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

  const handleWatchTutorial = (courseId,tutorId) => {
    navigate(`/tutorials/${courseId}/list/${tutorId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="h-20">
        <Header />
      </div>
      <main className="flex-1">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[20vh] bg-[#0a0a0a]"
        >
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">
              <span className="block font-light text-zinc-300">Your Learning</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                Journey Continues
              </span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Track your progress and continue learning from your purchased courses
            </p>
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-[#0a0a0a]"
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">My Courses</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search my courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                />
                <Search className="absolute left-3 top-3 text-zinc-400" />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-black rounded-2xl shadow-xl border border-cyan-900/20"
                  >
                    <div className="relative">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-white mb-2">{course.course_title}</h3>
                        <p className="text-zinc-400 text-sm">{course.course_description}</p>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-zinc-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{course.duration_weeks} weeks duration</span>
                        </div>
                        <div className="flex items-center text-zinc-400">
                          <Award className="w-4 h-4 mr-2" />
                          <span>Tutor: {course.tutor?.first_name} {course.tutor?.last_name || ''}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-zinc-400 mb-1">
                          <span>Progress</span>
                          <span>{course.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                            style={{ width: `${course.progress || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleWatchTutorial(course.id,course.tutor_id)}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white rounded-full hover:shadow-[0_0_20px_rgba(79,236,255,0.3)] transition-all duration-300"
                      >
                        <Play className="w-5 h-5" />
                        <span>Continue Learning</span>
                      </button>
                    </div>
                  </motion.div>
                ))}

                {filteredCourses.length === 0 && (
                  <div className="col-span-3 text-center py-20">
                    <p className="text-zinc-400 text-lg">No purchased courses found</p>
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

export default PurchasedCoursesPage;