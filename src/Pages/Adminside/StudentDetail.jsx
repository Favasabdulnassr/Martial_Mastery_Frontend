import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AdminSidebar from '@/Components/AdminSidebar';
import AdminTopbar from '@/Components/AdminTopbar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const StudentPage = () => {
  const navigate = useNavigate()
  const {isAuthenticated, is_superuser, first_name, is_tutor, phone_number, email} = useSelector((state)=> state.login)

  useEffect(()=>{
    if(!isAuthenticated || !is_superuser){
      navigate('\login')

    }
  },[isAuthenticated,is_superuser])

  const [students] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      course: 'Karate',
      joinDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      course: 'Judo',
      joinDate: '2024-02-20',
      status: 'active'
    },
    // Add more sample data as needed
  ]);

  return (

    <>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className='flex-1 lg:ml-80'>
          <AdminTopbar />


          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Students</h1>
              <p className="text-gray-500 mt-1">Manage your martial arts students</p>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              <button className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add New Student</span>
              </button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-medium text-gray-600">Name</th>
                        <th className="text-left p-4 font-medium text-gray-600">Email</th>
                        <th className="text-left p-4 font-medium text-gray-600">Course</th>
                        <th className="text-left p-4 font-medium text-gray-600">Join Date</th>
                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                        <th className="text-right p-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                                <span className="text-white text-sm">{student.name.split(' ').map(n => n[0]).join('')}</span>
                              </div>
                              <span className="font-medium text-gray-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{student.email}</td>
                          <td className="p-4 text-gray-600">{student.course}</td>
                          <td className="p-4 text-gray-600">{student.belt}</td>
                          <td className="p-4 text-gray-600">{student.joinDate}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Edit2 className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>




      </div>




    </>

  );
};

export default StudentPage;