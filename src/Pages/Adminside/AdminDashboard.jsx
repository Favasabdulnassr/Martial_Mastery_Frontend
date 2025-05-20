import AdminSidebar from '@/Components/AdminSidebar'
import AdminTopbar from '@/Components/AdminTopbar'
import { StatCard } from '@/Components/StateCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import axiosInstance from '@/services/interceptor'
import { AlertCircle, BookOpen, CircleDollarSign, GraduationCap, UserCog, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'

function AdminDashboard() {
  const { isAuthenticated, role } = useSelector((state) => state.login)
  const navigate = useNavigate()

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/')
    }
  }, [isAuthenticated, role, navigate])

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axiosInstance.get('dashboard/get_stats/')
      console.log('daaaaaaaaaaaaaaaa',response.data);
      
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (!dashboardData) return null

  const courseStatusData = [
    {
      name: 'Courses',
      Pending: dashboardData.course_status?.pending || 0,
      Approved: dashboardData.course_status?.approved || 0,
      Rejected: dashboardData.course_status?.rejected || 0,
    }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-80">
        <AdminTopbar />
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"> */}
            <StatCard
              title="Total Revenue"
              value={`$${dashboardData.total_revenue || 0}`}
              icon={<CircleDollarSign className="h-6 w-6" />}
            />
            <StatCard
              title="Total Users"
              value={dashboardData.total_users || 0}
              icon={<Users className="h-6 w-6" />}
            />
            <StatCard
              title="Total Courses"
              value={dashboardData.total_courses || 0}
              icon={<BookOpen className="h-6 w-6" />}
            />
            <StatCard
              title="Pending Approvals"
              value={dashboardData.course_status?.pending || 0}
              icon={<AlertCircle className="h-6 w-6" />}
            />

            <StatCard
              title="Total Students"
              value={dashboardData.user_roles?.students || 0}
              icon={<GraduationCap className="h-6 w-6" />}
            />
            <StatCard
              title="Total Tutors"
              value={dashboardData.user_roles?.tutors || 0}
              icon={<UserCog className="h-6 w-6" />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer>
                    <BarChart data={courseStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Pending" fill="#ffd700" />
                      <Bar dataKey="Approved" fill="#82ca9d" />
                      <Bar dataKey="Rejected" fill="#ff7f7f" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recent_transactions?.map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">${transaction.amount_paid}</span>
                      <span className="text-gray-600">
                        {new Date(transaction.payment_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard