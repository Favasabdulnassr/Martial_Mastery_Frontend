import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, EyeClosedIcon, LucideEye, EyeIcon } from 'lucide-react';
import AdminTopbar from '@/Components/AdminTopbar';
import AdminSidebar from '@/Components/AdminSidebar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/services/interceptor';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.login);


  useEffect(() => {
    if (role !== 'admin') {
      navigate('/');
    } else {
      fetchCourses();
    }
  }, [role, navigate]);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('course/completed/');
      console.log(response.data);
      
      setCourses(response.data);
    } catch (error) {
      console.error(error)
    }
  };

  const handleApprove = async (courseId) => {
    try {
      await axiosInstance.put(`courses/${courseId}/approve/`);
      toast.success('Course approved successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to approve course');
    }
  };

  const handleReject = async (courseId) => {
    try {
      await axiosInstance.put(`courses/${courseId}/reject/`);
      toast.success('Course rejected');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to reject course');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-80">
        <AdminTopbar />
        <div className="p-6">
          <div className="bg-white rounded-xl shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Course Review Management</h2>
            </div>
            
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="p-4 text-left">Course Name</th>
                  <th className="p-4 text-left">Tutor</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center">Details</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-200">
                    <td className="p-4 font-medium">{course.title}</td>
                    <td className="p-4">{course.tutor.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        course.status === 'approved' ? 'bg-green-100 text-green-800' :
                        course.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => navigate(`/admin/courseDetails/${course.id}`)}
                          className="text-blue-600 hover:text-blue-800 p-2"
                        >
                          <div className='flex '>
                        <EyeIcon className="w-5 h-5 " />
                        <p className='px-1'>course details</p>
                        
                        </div>
                          
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
     
    </div>
  );
};

export default AdminCourses;