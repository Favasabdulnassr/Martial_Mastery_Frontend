import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import AdminSidebar from '@/Components/AdminSidebar';
import AdminTopbar from '@/Components/AdminTopbar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Fetchtutors } from '@/Redux/Actions/TutorAction';

const TutorDetails = () => {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useSelector((state) => state.login)

  const { tutors, loading, error, next, previous, totalCount } = useSelector((state) => state.tutorsList);
  const itemsPerPage = 5;  // this number set what we backend setup itemsPerpage
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/')
    }
  }, [isAuthenticated, role, navigate])

  useEffect(() => {
    dispatch(Fetchtutors({ search: searchQuery, page }));
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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-80">
        <AdminTopbar />

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tutors</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your martial arts Tutors</p>
          </div>

          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm sm:text-base"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="block md:hidden">
                {/* Mobile card view (displays under 768px) */}
                {loading ? (
                  <div className="p-4 text-center">Loading...</div>
                ) : error ? (
                  <div className="p-4 text-center text-red-600">{error}</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {tutors.map((tutor) => (
                      <div key={tutor.id || tutor.email} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">{tutor.first_name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <span className="font-medium text-gray-900">{tutor.first_name}</span>
                        </div>
                        <div className="ml-11 space-y-1 text-sm">
                          <div className="text-gray-600">
                            <span className="text-gray-500">Email: </span>{tutor.email}
                          </div>
                          <div className="text-gray-600">
                            <span className="text-gray-500">Phone: </span>{tutor.phone_number}
                          </div>
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
                      <th className="text-left p-4 font-medium text-gray-600">Phone Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="text-center p-4">Loading...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="3" className="text-center p-4 text-red-600">{error}</td>
                      </tr>
                    ) : (
                      tutors.map((tutor) => (
                        <tr key={tutor.id || tutor.email} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                                <span className="text-white text-sm">{tutor.first_name.split(' ').map(n => n[0]).join('')}</span>
                              </div>
                              <span className="font-medium text-gray-900">{tutor.first_name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{tutor.email}</td>
                          <td className="p-4 text-gray-600">{tutor.phone_number}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <button
              disabled={!previous}
              onClick={() => handlePageChange('previous')}
              className="w-full sm:w-auto bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-600 text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={!next}
              onClick={() => handlePageChange('next')}
              className="w-full sm:w-auto bg-gray-200 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;