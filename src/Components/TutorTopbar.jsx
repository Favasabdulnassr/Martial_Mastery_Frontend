import React, { useState } from 'react';

import {
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/Redux/Reducers/LoginReducer';
import NotificationBell from './Notification';
import { useTutorSidebar } from './TutorSidebarProvider';

const TutorTopbar = () => {
  const { isSidebarTutorOpen, setSidebarTutorOpen } = useTutorSidebar();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const { first_name } = useSelector((state) => state.login);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="sticky top-0 bg-gray-200 border-gray-300 z-30 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="lg:hidden">
          <span className="text-xl font-bold text-gray-800">TutorPro</span>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          {/* Notification Bell Component */}
          <NotificationBell />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="h-8 w-8 rounded-lg bg-gray-600 flex items-center justify-center">
                <span className="text-white text-sm">TR</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-300 py-2">
                <div className="px-4 py-2 border-b border-gray-300">
                  <p className="text-sm font-medium text-gray-800">{first_name}</p>
                  <p className="text-xs text-gray-500">Professional Tutor</p>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Toggle Button - only visible on mobile */}
          <button 
            onClick={() => setSidebarTutorOpen(!isSidebarTutorOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarTutorOpen ? 
              <X className="w-6 h-6 text-gray-800" /> : 
              <Menu className="w-6 h-6 text-gray-800" />
            }
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TutorTopbar;