import React, { useState } from 'react';
import {
  Home,
  LogOut,
  Users,
  UserPlus,
  Target,
  Bell,
  BarChart2,
  Settings,
  Mail,
  Search,
  Calendar,
  TrendingUp,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  
  const menuItems = [
    { icon: <Home />, label: 'Dashboard', notifications: 0 },
    { icon: <Users />, label: 'Students', notifications: 12 },
    { icon: <UserPlus />, label: 'Tutors', notifications: 3 },
    { icon: <Target />, label: 'Courses', notifications: 5 },
    { icon: <BarChart2 />, label: 'Analytics', notifications: 0 },
    { icon: <Mail />, label: 'Messages', notifications: 8 },
    { icon: <Settings />, label: 'Settings', notifications: 1 },
    { icon: <Calendar />, label: 'clalendar', notifications: 1 }
  ];

  const stats = [
    { 
      label: 'Total Students', 
      value: '2,845', 
      trend: '+12%',
      icon: <Users className="w-6 h-6 text-gray-600" />
    },
    { 
      label: 'Active Courses', 
      value: '186', 
      trend: '+5%',
      icon: <Target className="w-6 h-6 text-gray-600" />
    },
    { 
      label: 'Total Revenue', 
      value: '$42.5k', 
      trend: '+8%',
      icon: <TrendingUp className="w-6 h-6 text-gray-600" />
    },
    { 
      label: 'Completion Rate', 
      value: '92%', 
      trend: '+3%',
      icon: <BarChart2 className="w-6 h-6 text-gray-600" />
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full 
        w-72 lg:w-80 
        bg-white 
        border-r border-gray-200
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        z-20
      `}>
        {/* Logo */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">MartialMaster</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    setActiveMenu(item.label);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-300 ${
                    activeMenu === item.label
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="w-5 h-5 mr-3">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {item.notifications > 0 && (
                    <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {item.notifications}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-80">
        {/* Top Navbar */}
        <nav className="sticky top-0 bg-white border-b border-gray-200 z-30 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <span className="text-xl font-bold text-gray-900">MartialMaster</span>
            </div>

            <div className="flex items-center space-x-4 ml-auto">
              <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-4 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 h-5 w-5 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                  3
                </span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-sm">JD</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-50 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        
      </div>
    </div>
  );
};

export default AdminDashboard;