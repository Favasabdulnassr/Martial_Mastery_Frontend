import AdminSidebar from '@/Components/AdminSidebar'
import AdminTopbar from '@/Components/AdminTopbar'
import axiosInstance from '@/services/interceptor'
import { Eye } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

function AdminReports() {
  const [reportedCourses, setReportedCourses] = useState([])
  const navigate = useNavigate()
  const { isAuthenticated, role } = useSelector((state) => state.login)
  const [flag, setFlag] = useState(false)

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
      setFlag((prev) => !prev)
    } catch (error) {
      console.error('Error unlisting course', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className='flex-1 lg:ml-80'>
        <AdminTopbar />
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reported Courses</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Manage reported courses and take action</p>
          </div>

          <div className="bg-white shadow-md rounded-lg">
            {/* Desktop view - Table layout (hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Course Name</th>
                    <th className="p-3">Tutor</th>
                    <th className="p-3">Report Count</th>
                    <th className="p-3">Actions</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {reportedCourses.map((course) => (
                    <tr key={course.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{course.name}</td>
                      <td className="p-3">{course.tutor_name}</td>
                      <td className="p-3 text-red-600 font-bold">{course.report_count}</td>
                      <td className="p-3">
                        <Link
                          to={`/admin/reports-details/${course.id}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center w-fit"
                        >
                          <Eye className="w-5 h-5 mr-1" />
                          <span>View details</span>
                        </Link>
                      </td>
                      <td className="p-3">
                        {course.report_count > 0 && (
                          <button
                            onClick={() => handleUnlistCourse(course.course_id)}
                            disabled={course.status === 'rejected'}
                            className={`px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 ${
                              course.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''
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
            
            {/* Mobile view - Card layout (shown only on mobile) */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {reportedCourses.map((course) => (
                  <div key={course.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{course.name}</span>
                      <span className="text-red-600 font-bold">
                        {course.report_count} {course.report_count === 1 ? 'report' : 'reports'}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-600">
                        <span className="text-gray-500">Tutor: </span>{course.tutor_name}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Link
                          to={`/admin/reports-details/${course.id}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span>View details</span>
                        </Link>
                        
                        {course.report_count > 0 && (
                          <button
                            onClick={() => handleUnlistCourse(course.course_id)}
                            disabled={course.status === 'rejected'}
                            className={`px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 text-sm ${
                              course.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            Unlist
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Empty state */}
            {reportedCourses.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No reported courses found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminReports