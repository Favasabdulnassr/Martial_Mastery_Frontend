import React, { useState } from 'react';
import { useSidebar } from './SidebarProvider';

import {
  Home,
  LogOut,
  Users,
  BookOpen,
  MessageCircle,
  Calendar,
  Clipboard,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch } from 'react-redux';
import { logout } from '@/Redux/Reducers/LoginReducer';

const TutorTopbar = () => {
//   const [activeMenu, setActiveMenu] = useState('Dashboard');
 const { isSidebarOpen, setSidebarOpen } = useSidebar();

  const [isProfileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch()

  const handleLogout = ()=>{
    dispatch(logout())
  }
  
  const menuItems = [
    { icon: <Home />, label: 'Dashboard', notifications: 0 },
    { icon: <Users />, label: 'My Students', notifications: 7 },
    { icon: <BookOpen />, label: 'Courses', notifications: 3 },
    { icon: <Clipboard />, label: 'Assignments', notifications: 5 },
    { icon: <MessageCircle />, label: 'Messages', notifications: 12 },
    { icon: <Settings />, label: 'Settings', notifications: 1 },
  ];

  const stats = [
    { 
      label: 'Total Students', 
      value: '45', 
      trend: '+8%',
      icon: <Users className="w-6 h-6 text-blue-400" />
    },
    { 
      label: 'Active Courses', 
      value: '6', 
      trend: '+3%',
      icon: <BookOpen className="w-6 h-6 text-blue-400" />
    },
    { 
      label: 'Pending Assignments', 
      value: '22', 
      trend: '+5%',
      icon: <Clipboard className="w-6 h-6 text-blue-400" />
    },
    { 
      label: 'Total Revenue', 
      value: '$6.5k', 
      trend: '+12%',
      icon: <MessageCircle className="w-6 h-6 text-blue-400" />
    },
  ];

  
  return (
    <>
  
        {/* Top Navbar */}
        <nav className="sticky top-0 bg-gray-800 border-b border-gray-700 z-30 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <span className="text-xl font-bold text-gray-100">TutorPro</span>
            </div>

            <div className="flex items-center space-x-4 ml-auto">
              {/* <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-4 pr-10 py-2 rounded-xl bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div> */}

              <button className="relative p-2 rounded-lg hover:bg-gray-700">
                <Bell className="w-6 h-6 text-gray-300" />
                <span className="absolute top-0 right-0 h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                  3
                </span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm">JW</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-300" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700 py-2">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-gray-100">John Walker</p>
                      <p className="text-xs text-gray-400">Professional Tutor</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
              >
                {isSidebarOpen ? <X className="w-6 h-6 text-gray-100" /> : <Menu className="w-6 h-6 text-gray-100" />}
              </button>
            </div>
          </div>
        </nav>

        </>
  );
};

export default TutorTopbar;