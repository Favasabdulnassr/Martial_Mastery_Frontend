import React, { useEffect, useState } from 'react';
import { useSidebar } from './SidebarProvider';
import { Link, useLocation } from 'react-router-dom';

import {
  UserCircle,
  Users,
  BookOpen,
  Wallet,
  X
} from 'lucide-react';

const TutorSidebar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const { isSidebarOpen, setSidebarOpen } = useSidebar();

  // Menu items configuration
  const menuItems = [
    { icon: <UserCircle />, label: 'Profile', path: '/tutor/Profile' },
    { icon: <Users />, label: 'My Students', path: '/tutor/students' },
    { icon: <BookOpen />, label: 'Course Management', path: '/tutor/courseManagement' },
    { icon: <BookOpen />, label: 'Purchased Course', path: '/tutor/PurchasedCourse' },
    { icon: <Wallet />, label: 'My Wallet', path: '/tutor/wallet' },
  ];

  // Update active menu when location changes
  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only run on mobile views
      if (window.innerWidth < 1024 && isSidebarOpen) {
        const sidebar = document.getElementById('tutor-sidebar');
        const toggler = document.getElementById('sidebar-toggler');
        
        if (sidebar && !sidebar.contains(event.target) && 
            toggler && !toggler.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, setSidebarOpen]);

  // Handle window resize to auto-show sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setSidebarOpen]);

  return (
    <>
      {/* Sidebar backdrop - only visible on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        id="tutor-sidebar"
        className={`
          fixed top-0 left-0 h-full 
          w-64 sm:w-72 lg:w-80 
          bg-gray-800 
          border-r border-gray-700
          transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          z-20
          overflow-y-auto
        `}
      >
        {/* Logo and close button */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xl sm:text-2xl font-bold">T</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-100 tracking-tight">TutorPro</span>
          </div>
          
          {/* Close button - only on mobile */}
          <button 
            className="lg:hidden text-gray-400 hover:text-white p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 sm:mt-8">
          <ul className="space-y-1 sm:space-y-2 px-3 sm:px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>
                  <button
                    onClick={() => {
                      setActiveMenu(item.path);
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center p-2.5 sm:p-3.5 rounded-xl transition-all duration-300 ${
                      activeMenu === item.path
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <span className="w-5 h-5 mr-3">
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm sm:text-base">{item.label}</span>
                    {item.notifications > 0 && (
                      <span className="ml-auto bg-blue-900 text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.notifications}
                      </span>
                    )}
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Version info or footer info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-gray-500 text-xs">
          <p>TutorPro v1.0</p>
        </div>
      </div>
    </>
  );
};

export default TutorSidebar;