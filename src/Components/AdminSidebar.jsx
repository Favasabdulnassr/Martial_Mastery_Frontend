import React, { useEffect, useState } from 'react';
import {
  Home,
  Users,
  UserPlus,
  Target,
  BarChart2,
  Settings,
  Mail,
  Calendar,
} from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const { isSidebarOpen, setSidebarOpen } = useSidebar();
  const location = useLocation();


  const [activeMenu, setActiveMenu] = useState(location.pathname);

  
  const menuItems = [
    { icon: <Home />, label: 'Dashboard',path: '/admin'},
    { icon: <Users />, label: 'Students' ,path: '/students'},
    { icon: <UserPlus />, label: 'Tutors' ,path: '/tutors'},
    { icon: <Target />, label: 'Courses' ,path: '/Courses'},
    { icon: <BarChart2 />, label: 'Analytics' ,path: '/Analytics'},
    { icon: <Mail />, label: 'Messages',path: '/Messages' },
    { icon: <Settings />, label: 'Settings' ,path: '/Settings'},
    { icon: <Calendar />, label: 'clalendar' ,path: '/clalendar'}
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
                <Link to={item.path}>
                <button
                  onClick={() => {
                    setActiveMenu(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center p-3.5 rounded-xl transition-all duration-300 ${
                    activeMenu === item.path
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="w-5 h-5 mr-3">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                 
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

export default AdminSidebar