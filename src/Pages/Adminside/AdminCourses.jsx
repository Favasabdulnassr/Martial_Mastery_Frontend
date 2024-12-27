import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AdminTopbar from '@/Components/AdminTopbar';
import AdminSidebar from '@/Components/AdminSidebar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '@/Components/Modal/ModalPortal';
import AddCourse from '@/Components/Modal/Courses/AddCourses';
import axiosInstance from '@/services/interceptor';
import { BASE_URL } from '@/services/constents';
import { toast } from 'react-toastify';
import EditCourse from '@/Components/Modal/Courses/EditCourses';
import DeleteCourse from '@/Components/Modal/Courses/DeleteCourses';

// Placeholder data - replace with actual API call


function AdminCourses() {
  const { isAuthenticated, role } = useSelector((state) => state.login);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([  ]);
  const [filteredCourses, setFilteredCourses] = useState([]); // State for filtered courses
  // const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [triggerEffect, setTriggerEffect] = useState(false); // Track when to trigger the useEffect

  const [selectedCourse, setSelectedCourse] = useState(null);



  const handleDeleteClick = (courseId) => {
    setSelectedCourse(courseId);
    setDeleteModal(true);
  };

 



  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    }
    else if (role == 'admin'){
      const fetchCourses = async () =>{
        try {
          const response = await axiosInstance.get('courses/')
          setCourses(response.data)
          setFilteredCourses(response.data)
          
        } catch (error) {
          console.error('Error fetching courses:', error);
        toast.error('Failed to fetch courses.');
        }
      }
      fetchCourses()

    }
  }, [isAuthenticated, role, navigate,triggerEffect]);

  const handleEditCourse = (course) => {
    console.log('Edit course:', course);
    setCourseToEdit(course); // Set the course to be edited
    setEditCourseModalOpen(true); // Open the modal
    
  };



  const handleUpdateCourse = async(updatedCourse) =>{
    try {
      await axiosInstance.put(`courses/${updatedCourse.id}/update/`,updatedCourse);
      setTriggerEffect(prev => !prev)
      
      toast.success('Course updated successfully!');
      setEditCourseModalOpen(false);
    } catch (error) {
      console.error('Error updating course:', error);
     toast.error('Failed to update the course.');
      
    }
  }


  const handleAddCourse = async(Courses) => {
    try {
      const response = await axiosInstance.post('course/create/',Courses)
      console.log('sssssssssssssssssucccccccccccccccccccess',response)
      setTriggerEffect(prev => !prev)

      toast.success('Course created Successfully')
    } catch (error) {
      console.error('nooooooooooooooooooooooooooo',error)
      toast.error('Error when course creating ')
      
    }


    
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
                  
                  // onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Courses..."
                  className="px-4 py-2 border rounded-lg text-sm"
                />

                <button
                  onClick={()=>setAddCourseModalOpen(true)}
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
                 
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
              {courses && courses.length > 0 ?(
               courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium">{course.name}</td>
                    <td className="p-4 text-gray-600">{course.description}</td>
                    <td className="p-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(course.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ):(
                <tr >
                  <td colSpan="5" className="text-center p-8 text-gray-500">
                  {courses ? 'No courses found. Add a new course to get started.' : 'Loading courses...'}

                  </td>
                </tr>
              )
              }
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
      
      <Modal isOpen={isAddCourseModalOpen} onClose={()=>setAddCourseModalOpen(false)}>
        <AddCourse onAdd={handleAddCourse} onClose={()=>setAddCourseModalOpen(false)}/>
      </Modal>


      {isEditCourseModalOpen && (
  <Modal
    isOpen={isEditCourseModalOpen}
    onClose={() => setEditCourseModalOpen(false)}
  >
    <EditCourse
      course={courseToEdit}
      onUpdate={handleUpdateCourse}
      onClose={() => setEditCourseModalOpen(false)}
    />
  </Modal>
  
)}


{deleteModal && (
        <DeleteCourse
          courseId={selectedCourse}
          onClose={() => setDeleteModal(false)}
          setTriggerEffect = {setTriggerEffect}
        />
      )}

    </div>
  );
}

export default AdminCourses;
