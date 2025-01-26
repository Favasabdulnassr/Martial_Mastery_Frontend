import React, { useEffect, useState } from 'react';
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
  ChevronDown,
  User,
  UserCircle,
  Wallet
} from 'lucide-react';
import { Link,useLocation } from 'react-router-dom';

const TutorSidebar = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const { isSidebarOpen, setSidebarOpen } = useSidebar();

//   const [isProfileOpen, setProfileOpen] = useState(false);
  
  const menuItems = [
    { icon: <UserCircle />, label: 'Profile',path: '/tutor/Profile' },
    { icon: <Users />, label: 'My Students', path: '/tutor/students' },
    // { icon: <BookOpen />, label: 'My Tutorials', path: '/tutor/tutorials'},
    { icon: <BookOpen />, label: 'Course Management', path: '/tutor/courseManagement'},
    {icon:<BookOpen/>, label:'Purchased Course', path: '/tutor/PurchasedCourse'}

    // { icon: <Wallet />, label: 'My Wallet', path: '/tutor/wallet' },

    // {icon:<Bell/>,label:'MyTutorial', path:'/tutor/Tutorial'}
    // { icon: <Clipboard />, label: 'Assignments', path: '/tutor/dashboard' },
    // { icon: <MessageCircle />, label: 'Messages', path: '/tutor/dashboard' },
    // { icon: <Settings />, label: 'Settings', path: '/tutor/dashboard' },
  ];

  useEffect(()=>{
    setActiveMenu(location.pathname);

  },[location.pathname])



  



  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full 
        w-72 lg:w-80 
        bg-gray-800 
        border-r border-gray-700
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        z-20
      `}>
        {/* Logo */}
        <div className="p-8 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-100 tracking-tight">TutorPro</span>
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
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-300 ${
                    activeMenu === item.path
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <span className="w-5 h-5 mr-3">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {item.notifications > 0 && (
                    <span className="ml-auto bg-blue-900 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">
                      {item.notifications}
                    </span>
                  )}
                </button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

     
      </>
  );
};

export default TutorSidebar;