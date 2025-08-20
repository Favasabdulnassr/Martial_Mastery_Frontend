import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Search, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import axiosInstance from '@/services/interceptor';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTutorSidebar } from '@/Components/TutorSidebarProvider';

const TutorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const { user } = useSelector((state) => state.login);
  const navigate = useNavigate();
  const { isSidebarTutorOpen } = useTutorSidebar();

  useEffect(() => {
    fetchStudents();
  }, [searchQuery, page]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axiosInstance.get(`payments/tutors/${user.id}/students/`);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && hasNext) {
      setPage(page + 1);
    } else if (direction === 'previous' && hasPrevious) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar - Fixed position on large screens, hidden or overlay on mobile */}
      <div className={`fixed top-0 left-0 h-full w-72 lg:w-80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 z-20 ${
        isSidebarTutorOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <TutorSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:ml-80">
        {/* Topbar */}
        <TutorTopbar />

        {/* Page Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Students</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">View and manage your enrolled students</p>
          </div>

          {/* Search bar */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-800 text-sm sm:text-base"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Students card/table */}
          <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <CardContent className="p-0">
              {/* Mobile card view (displays under 768px) */}
              <div className="block md:hidden">
                {loading ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : students.length === 0 ? (
                  <div className="p-4 text-center">No students found</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <div key={student.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-10 w-10 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium">
                              {student.first_name && student.first_name[0] ? student.first_name[0].toUpperCase() : '?'}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">{student.first_name}</span>
                        </div>
                        <div className="ml-13 space-y-1 text-sm">
                          <div className="text-gray-700">
                            <span className="text-gray-600">Email: </span>{student.email}
                          </div>
                          <div className="text-gray-700">
                            <span className="text-gray-600">Phone: </span>{student.phone_number || 'N/A'}
                          </div>
                          <div>
                            <span className="text-gray-600">Courses: </span>
                            {student.purchased_courses && student.purchased_courses.length > 0 ? (
                              <ul className="pl-2 mt-1">
                                {student.purchased_courses.map((course) => (
                                  <li key={course.id} className="text-gray-700">
                                    {course.course_title}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-gray-500">No courses purchased</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleChatClick(student.id)}
                            className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Chat</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop table view (displays above 768px) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 font-medium text-gray-600">Name</th>
                      <th className="text-left p-4 font-medium text-gray-600">Email</th>
                      <th className="text-left p-4 font-medium text-gray-600">Phone</th>
                      <th className="text-left p-4 font-medium text-gray-600">Purchased Tutorials</th>
                      <th className="text-left p-4 font-medium text-gray-600">Actions</th>
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
                        <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-gray-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {student.first_name && student.first_name[0] ? student.first_name[0].toUpperCase() : '?'}
                                </span>
                              </div>
                              <span className="text-gray-800">{student.first_name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-700">{student.email}</td>
                          <td className="p-4 text-gray-700">{student.phone_number || 'N/A'}</td>
                          <td className="p-4">
                            {student.purchased_courses && student.purchased_courses.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {student.purchased_courses.map((course) => (
                                  <li key={course.id} className="text-gray-700">
                                    {course.course_title}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-gray-500">No courses purchased</span>
                            )}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleChatClick(student.id)}
                              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
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
            </CardContent>
          </Card>

          {/* Pagination controls */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <button
              disabled={!hasPrevious}
              onClick={() => handlePageChange('previous')}
              className="w-full sm:w-auto flex items-center justify-center space-x-1 bg-white border border-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 text-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-gray-500 text-sm">
              Page {page} {totalCount > 0 && ` of ${Math.ceil(totalCount / 10)}`}
            </span>

            <button
              disabled={!hasNext}
              onClick={() => handlePageChange('next')}
              className="w-full sm:w-auto flex items-center justify-center space-x-1 bg-white border border-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 text-gray-700"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorStudents;