import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import AdminSidebar from '@/Components/AdminSidebar';
import AdminTopbar from '@/Components/AdminTopbar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FetchUsers } from '@/Redux/Actions/UsersAction';

const StudentDetails = () => {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useSelector((state) => state.login)

  const { users, loading, error, next,previous, totalCount } = useSelector((state) => state.usersList);
  const itemsPerPage = 5;  // this number set what we backend setup itemsPerpage
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);




  useEffect(() => {
    if (role !== 'admin') {
      navigate('/')
    }

  }, [isAuthenticated, role])


  useEffect(() => {
    console.log('sshshshshshscndhiosfho', users)
  })

  useEffect(() => {
    dispatch(FetchUsers({ search: searchQuery, page }));
  }, [dispatch, searchQuery, page]);


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    setPage(1)
  }

  const handlePageChange = (direction) => {
    if (direction === 'next' && next) {
      setPage(page + 1);
    } else if (direction === 'previous' && previous) {
      setPage(page - 1);
    }
  };




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
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* <button className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add New Student</span>
              </button> */}
            </div>


            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-medium text-gray-600">Name</th>
                        <th className="text-left p-4 font-medium text-gray-600">Email</th>
                        {/* <th className="text-left p-4 font-medium text-gray-600">Course</th> */}
                        <th className="text-left p-4 font-medium text-gray-600">phone_number</th>
                        {/* <th className="text-left p-4 font-medium text-gray-600">Status</th> */}
                        {/* <th className="text-right p-4 font-medium text-gray-600">Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center p-4">Loading...</td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="6" className="text-center p-4 text-red-600">{error}</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id || user.email} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                                  <span className="text-white text-sm">{user.first_name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <span className="font-medium text-gray-900">{user.first_name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-600">{user.email}</td>
                            {/* <td className="p-4 text-gray-600">{student.course}</td> */}
                            <td className="p-4 text-gray-600">{user.phone_number},{user.role}</td>
                            {/* <td className="p-4 text-gray-600">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </span>
                            </td> */}
                            {/* <td className="p-4">
                              <div className="flex items-center justify-end space-x-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <Edit2 className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </td> */}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className='mt-4 flex justify-between items-center'>
              <button
                disabled={!previous}
                onClick={() => handlePageChange('previous')}

                className='bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50'
              >
                Previous

              </button>

              <span className='text-gray-600'>
                Page of {page} of {totalPages}
              </span>

              <button
                disabled={!next}
                onClick={() => handlePageChange('next')}

                className="bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"

              >
                Next
              </button>

            </div>



          </div>


        </div>




      </div>




    </>

  );
};

export default StudentDetails;