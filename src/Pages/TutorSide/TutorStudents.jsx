import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Search, ChevronLeft, ChevronRight, MessageCircle, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '@/services/interceptor';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TutorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [searchQuery, page]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`payment/tutor/${user.id}/students/`);
      setStudents(response.data);
      // Uncomment when pagination is implemented in the backend
      // setTotalCount(response.data.count);
      // setHasNext(response.data.has_next);
      // setHasPrevious(response.data.has_previous);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (studentId) => {
    navigate(`/tutor/chat/${studentId}`);
  };

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
          <h1 className="text-xl font-bold">My Students</h1>
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
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block mb-6"
            >
              <h1 className="text-2xl font-bold">My Students</h1>
              <p className="text-gray-400 mt-1">View and manage your enrolled students</p>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative mb-6"
            >
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </motion.div>

            {/* Students card/table - responsive */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden mb-6">
                <CardContent className="p-0 overflow-x-auto">
                  {/* Desktop table - hidden on mobile */}
                  <div className="hidden md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 font-medium text-gray-400">Name</th>
                          <th className="text-left p-4 font-medium text-gray-400">Email</th>
                          <th className="text-left p-4 font-medium text-gray-400">Phone</th>
                          <th className="text-left p-4 font-medium text-gray-400">Purchased Tutorials</th>
                          <th className="text-left p-4 font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="text-center p-4">Loading...</td>
                          </tr>
                        ) : students.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center p-4">No students found</td>
                          </tr>
                        ) : (
                          students.map((student) => (
                            <tr key={student.id} className="border-b border-gray-700">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-medium">
                                      {student.first_name && student.first_name[0] ? student.first_name[0].toUpperCase() : '?'}
                                    </span>
                                  </div>
                                  <span>{student.first_name}</span>
                                </div>
                              </td>
                              <td className="p-4">{student.email}</td>
                              <td className="p-4">{student.phone_number || 'N/A'}</td>
                              <td className="p-4">
                                {student.purchased_courses && student.purchased_courses.length > 0 ? (
                                  <ul className="list-disc list-inside">
                                    {student.purchased_courses.map((course) => (
                                      <li key={course.id} className="text-gray-300">
                                        {course.course_title}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span className="text-gray-400">No courses purchased</span>
                                )}
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleChatClick(student.id)}
                                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  <span>Chat</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile card view */}
                  <div className="md:hidden">
                    {loading ? (
                      <div className="text-center p-4">Loading...</div>
                    ) : students.length === 0 ? (
                      <div className="text-center p-4">No students found</div>
                    ) : (
                      <div className="divide-y divide-gray-700">
                        {students.map((student) => (
                          <div key={student.id} className="p-4 space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {student.first_name && student.first_name[0] ? student.first_name[0].toUpperCase() : '?'}
                                </span>
                              </div>
                              <span className="font-medium">{student.first_name}</span>
                            </div>
                            
                            <div className="space-y-1 pl-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Email:</span>
                                <span className="text-sm">{student.email}</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Phone:</span>
                                <span className="text-sm">{student.phone_number || 'N/A'}</span>
                              </div>
                              
                              <div>
                                <span className="text-gray-400">Courses:</span>
                                {student.purchased_courses && student.purchased_courses.length > 0 ? (
                                  <ul className="text-sm mt-1 pl-2">
                                    {student.purchased_courses.map((course) => (
                                      <li key={course.id} className="text-gray-300">
                                        {course.course_title}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <span className="text-sm text-gray-400 block mt-1">No courses purchased</span>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleChatClick(student.id)}
                              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Chat</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pagination controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <button
                onClick={() => setPage(page - 1)}
                disabled={!hasPrevious}
                className="px-3 py-2 md:px-4 md:py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline ml-1">Previous</span>
              </button>
              <span className="text-sm md:text-base text-gray-400">
                Page {page}
                {totalCount > 0 && ` of ${Math.ceil(totalCount / 10)}`}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!hasNext}
                className="px-3 py-2 md:px-4 md:py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 flex items-center"
              >
                <span className="hidden md:inline mr-1">Next</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorStudents;