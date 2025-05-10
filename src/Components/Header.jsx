import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Info, BookOpen, LogIn, Menu, X, User, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/Redux/Reducers/LoginReducer';
import { toast } from 'react-toastify';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, first_name } = useSelector((state) => state.login);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showDropdown) return;
    
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Successfully logged out');
    setShowDropdown(false);
  };

  return (
    <>
      <header className="bg-black border-b border-zinc-900 text-white py-4 sm:py-6 fixed top-0 w-full z-10 shadow-lg">
        <nav className="container mx-auto flex justify-between items-center px-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
              Martial Mastery
            </h1>
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none hover:text-cyan-400 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {!isOpen ? (
                <Menu className="w-7 h-7" />
              ) : (
                <X className="w-7 h-7" />
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6 lg:space-x-12">
            <li>
              <Link to="/" className="flex items-center space-x-2 hover:text-cyan-400 transition-all duration-300 group">
                <Home className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                <span className="relative overflow-hidden">
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-100%]">Home</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 text-cyan-400 group-hover:translate-y-0">Home</span>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="flex items-center space-x-2 hover:text-fuchsia-400 transition-all duration-300 group">
                <Phone className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                <span className="relative overflow-hidden">
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-100%]">Contact</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 text-fuchsia-400 group-hover:translate-y-0">Contact</span>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="flex items-center space-x-2 hover:text-violet-400 transition-all duration-300 group">
                <Info className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                <span className="relative overflow-hidden">
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-100%]">About</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 text-violet-400 group-hover:translate-y-0">About</span>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/courses" className="flex items-center space-x-2 hover:text-cyan-400 transition-all duration-300 group">
                <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                <span className="relative overflow-hidden">
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-100%]">Course</span>
                  <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 text-cyan-400 group-hover:translate-y-0">Course</span>
                </span>
              </Link>
            </li>

            {isAuthenticated && (
              <li>
                <Link to="/purchased-courses" className="flex items-center space-x-2 hover:text-fuchsia-400 transition-all duration-300 group">
                  <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                  <span className="relative overflow-hidden">
                    <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-100%]">My Courses</span>
                    <span className="absolute top-0 left-0 translate-y-full transition-transform duration-300 text-fuchsia-400 group-hover:translate-y-0">My Courses</span>
                  </span>
                </Link>
              </li>
            )}

            <li>
              {isAuthenticated ? (
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 px-4 lg:px-6 py-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 text-white rounded-full hover:shadow-[0_0_20px_rgba(79,236,255,0.3)] transition-all duration-300"
                  >
                    <User className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm lg:text-base truncate max-w-24">{first_name || 'Profile'}</span>
                  </button>
                  {showDropdown && (
                    <ul className="absolute right-0 mt-2 w-40 bg-black border border-zinc-800 rounded-lg shadow-lg">
                      <li className="hover:bg-zinc-800 p-2 rounded-t-lg">
                        <Link to="/profile" onClick={() => setShowDropdown(false)}>
                          Profile
                        </Link>
                      </li>
                      <li className="hover:bg-zinc-800 p-2 rounded-b-lg">
                        <button onClick={handleLogout} className="w-full text-left">
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <button className="flex items-center space-x-2 px-4 lg:px-6 py-2 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 text-white rounded-full hover:shadow-[0_0_20px_rgba(79,236,255,0.3)] transition-all duration-300">
                    <LogIn className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm lg:text-base">Login</span>
                  </button>
                </Link>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-60 sm:w-72 bg-black border-l border-zinc-900 text-white transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out z-50 md:hidden shadow-2xl`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                  Menu
                </h2>
              </div>
              <button
                className="focus:outline-none hover:text-cyan-400 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <ul className="mt-6 space-y-4 px-4">
              <li>
                <Link
                  to="/"
                  className="flex items-center space-x-4 hover:text-cyan-400 transition-all duration-300 p-2 rounded-lg hover:bg-zinc-900"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="flex items-center space-x-4 hover:text-fuchsia-400 transition-all duration-300 p-2 rounded-lg hover:bg-zinc-900"
                  onClick={() => setIsOpen(false)}
                >
                  <Phone className="w-5 h-5" />
                  <span>Contact us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center space-x-4 hover:text-violet-400 transition-all duration-300 p-2 rounded-lg hover:bg-zinc-900"
                  onClick={() => setIsOpen(false)}
                >
                  <Info className="w-5 h-5" />
                  <span>About us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="flex items-center space-x-4 hover:text-cyan-400 transition-all duration-300 p-2 rounded-lg hover:bg-zinc-900"
                  onClick={() => setIsOpen(false)}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Course</span>
                </Link>
              </li>

              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/purchased-courses"
                      className="flex items-center space-x-4 hover:text-fuchsia-400 transition-all duration-300 p-2 rounded-lg hover:bg-zinc-900"
                      onClick={() => setIsOpen(false)}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>My Courses</span>
                    </Link>
                  </li>
                  
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-4 hover:text-green-400 transition-all duration-300 p-2 rounded-lg hover:bg-zinc-900"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div className="mt-auto p-4 border-t border-zinc-800">
              {isAuthenticated ? (
                <button
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-full hover:shadow-[0_0_20px_rgba(255,100,100,0.3)] transition-all duration-300"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 text-white rounded-full hover:shadow-[0_0_20px_rgba(79,236,255,0.3)] transition-all duration-300">
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 z-40 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </header>
      {/* Header spacer */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}

export default Header;