import React, { useEffect, useState } from 'react';
import { useTutorSidebar } from './TutorSidebarProvider';
import { Link, useLocation } from 'react-router-dom';

import {
  UserCircle,
  Users,
  BookOpen,
  Wallet,
} from 'lucide-react';

const TutorSidebar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const { isSidebarTutorOpen, setSidebarTutorOpen } = useTutorSidebar();

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

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full 
        w-72 lg:w-80 
        bg-gray-200 
        border-r border-gray-300
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isSidebarTutorOpen ? 'translate-x-0' : '-translate-x-full'}
        z-20
      `}>
        {/* Logo */}
        <div className="p-8 border-b border-gray-300">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-gray-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">TutorPro</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>
                  <button
                    onClick={() => {
                      setActiveMenu(item.path);
                      setSidebarTutorOpen(false);
                    }}
                    className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-300 ${
                      activeMenu === item.path
                        ? 'bg-gray-700 text-white'
                        : 'hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="w-5 h-5 mr-3">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {item.notifications > 0 && (
                      <span className="ml-auto bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
        {/* <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-gray-500 text-xs">
          <p>TutorPro v1.0</p>
        </div> */}
      </div>
    </>
  );
};

export default TutorSidebar;