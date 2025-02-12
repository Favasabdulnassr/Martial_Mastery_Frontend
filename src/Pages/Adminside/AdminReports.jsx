import AdminSidebar from '@/Components/AdminSidebar'
import AdminTopbar from '@/Components/AdminTopbar'
import axiosInstance from '@/services/interceptor'
import { Eye, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

function AdminReports() {
  const [reportedCourses, setReportedCourses] = useState([])
  const navigate = useNavigate()
  const { isAuthenticated, role } = useSelector((state) => state.login)
  const [flag,setFlag] = useState(false)

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/')
    }

  }, [isAuthenticated, role])


  useEffect(() => {
    const fetchReportedCourses = async () => {
      try {
        const response = await axiosInstance.get('adminside/reported-courses');
        console.log('reeeeeeeeeeeeeeeport', response.data);

        setReportedCourses(response.data)
      } catch (error) {
        console.error('Error fetching reported courses', error);
      }
    }
    fetchReportedCourses();

  }, [flag])


  const handleUnlistCourse = async (courseId) => {
    try {
        await axiosInstance.post(`unlist-course/${courseId}/`)
        setFlag((prev)=> !prev)
        
    } catch (error) {
        console.error('Error unlisting course', error)
    }
}

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className='flex-1 lg:ml-80'>
          <AdminTopbar />

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Reported Courses</h2>
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Course Name</th>
                  <th className="p-3">Tutor</th>
                  <th className="p-3">Report Count</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportedCourses.map((course) => (
                  <tr key={course.id} className="border-b">
                    <td className="p-3">{course.name}</td>
                    <td className="p-3">{course.tutor_name}</td>
                    <td className="p-3  text-red-600 font-bold">{course.report_count}</td>
                    <td className="p-3 flex space-x-2">
                      <Link
                        to={`/admin/reports-details/${course.id}`}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Eye />
                      </Link>
      
                    </td>
                    <td className="p-3 flex space-x-2">
                      {course.report_count > 0 && (
                        <button
                          onClick={() => handleUnlistCourse(course.course_id)}
                          disabled={course.status === 'rejected'}
                          className={`text-red-600 hover:text-red-800  ${course.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                          Unlist
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </div>


      </div>


    </>

  )
}

export default AdminReports