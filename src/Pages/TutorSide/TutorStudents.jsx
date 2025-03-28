import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Search, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

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
  const {user} = useSelector((state)=> state.login )
  const navigate = useNavigate()



  useEffect(() => {
    fetchStudents();
    
  }, [searchQuery, page]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log(user);
      
      const response = await axiosInstance.get(`payment/tutor/${user.id}/students/`);
      console.log('vallathum nadakko',response.data);
      
      setStudents(response.data);
      console.log('ppppppppppp',students);

      
      // setTotalCount(response.data);
      // setHasNext(response.data.results.has_next);
      // setHasPrevious(response.data.results.has_previous);
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
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <TutorSidebar />
      
      <div className="flex-1 lg:ml-80">
        <TutorTopbar />
        
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">My Students</h1>
            <p className="text-gray-400 mt-1">View and manage your enrolled students</p>
          </div>

          <div className="relative">
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
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
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
                      <td colSpan="4" className="text-center p-4">Loading...</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="border-b border-gray-700">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-medium">
                                {student.first_name[0].toUpperCase()}
                              </span>
                            </div>
                            <span>{student.first_name}</span>
                          </div>
                        </td>
                        <td className="p-4">{student.email}</td>
                        <td className="p-4">{student.phone_number}</td>
                        <td className="p-4">
                          {student.purchased_courses.length > 0 ? (
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
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!hasPrevious}
              className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-400">
              Page {page} of {Math.ceil(totalCount / 10)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!hasNext}
              className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorStudents;