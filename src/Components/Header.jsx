import React, { useState } from 'react';

function Header() {
  const [isOpen, setIsOpen] = useState(false); // State to control menu toggle

  return (
    <>
      <header className="bg-black text-white py-8 fixed top-0 w-full z-10">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl ml-2 font-bold">Martial Mastery</h1>

          {/* Hamburger Icon */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              <svg
                className="w-8 h-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={!isOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}
                />
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-20">
            <li className="hover:text-gray-400 transition">Home</li>
            <li className="hover:text-gray-400 transition">Contact us</li>
            <li className="hover:text-gray-400 transition">About us</li>
            <li className="hover:text-gray-400 transition">Course</li>
          </ul>
        </nav>

        {/* Off-canvas Menu for Mobile/Tablet */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-black text-white transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out z-50 md:hidden`}
        >
           {/* Close Button */}
           <button 
            className="absolute top-4 right-4 focus:outline-none" 
            onClick={() => setIsOpen(false)}
          >
            <svg
              className="w-8 h-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <ul className="mt-16 space-y-8 px-6">
            <li className="hover:text-gray-400 transition">Home</li>
            <li className="hover:text-gray-400 transition">Contact us</li>
            <li className="hover:text-gray-400 transition">About us</li>
            <li className="hover:text-gray-400 transition">Course</li>
          </ul>
        </div>

        {/* Overlay for Off-canvas */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </header>
    </>
  );
}

export default Header;
