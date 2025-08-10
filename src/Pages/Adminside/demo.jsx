import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminTopbar from '@/Components/AdminTopbar';
import AdminSidebar from '@/Components/AdminSidebar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Placeholder data - replace with actual API call
const initialCourses = [
  {
    id: 1,
    name: 'Brazilian Jiu-Jitsu Fundamentals',
    description: 'Comprehensive introduction to Brazilian Jiu-Jitsu techniques',
    instructor: 'John Doe',
    duration: '8 weeks'
  },
  {
    id: 2,
    name: 'Muay Thai Beginners',
    description: 'Learn the basics of Muay Thai striking',
    instructor: 'Jane Smith',
    duration: '6 weeks'
  },
  {
    id: 3,
    name: 'Advanced Karate Techniques',
    description: 'Mastering advanced Karate forms and strategies',
    instructor: 'Mike Johnson',
    duration: '10 weeks'
  }
];

function Demo() {
  const { isAuthenticated, role } = useSelector((state) => state.login);
  const navigate = useNavigate();
  const [courses, setCourses] = useState(initialCourses);
  const [filteredCourses, setFilteredCourses] = useState(initialCourses); // State for filtered courses
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    // Filter the courses based on the search query
    const filtered = courses.filter(course => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.duration.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]); // Re-run whenever searchQuery or courses change

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const handleEditCourse = (course) => {
  };

  const handleAddCourse = () => {
    setAddCourseModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className='flex-1 lg:ml-80'>
        <AdminTopbar />
        
        <div className="p-6">
          <div className="bg-white shadow-md rounded-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Courses Management</h2>
              
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Courses..."
                  className="px-4 py-2 border rounded-lg text-sm"
                />
                
                <button 
                  onClick={handleAddCourse}
                  className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Course</span>
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="p-4 text-left">Course Name</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Instructor</th>
                  <th className="p-4 text-left">Duration</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr 
                    key={course.id} 
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium">{course.name}</td>
                    <td className="p-4 text-gray-600">{course.description}</td>
                    <td className="p-4 text-gray-600">{course.instructor}</td>
                    <td className="p-4 text-gray-600">{course.duration}</td>
                    <td className="p-4">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleEditCourse(course)}
                          className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCourses.length === 0 && (
              <div className="text-center p-8 text-gray-500">
                No courses found. Add a new course to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Course Modal (to be implemented) */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Add New Course</h3>
            {/* Add form fields for course details */}
            <button 
              onClick={() => setAddCourseModalOpen(false)}
              className="mt-4 w-full bg-gray-900 text-white py-2 rounded-xl hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Demo;
