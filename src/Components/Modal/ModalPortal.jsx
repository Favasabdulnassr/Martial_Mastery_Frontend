// src/components/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

// Modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render modal if it's not open

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
          {/* Modal Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
};

export default Modal;