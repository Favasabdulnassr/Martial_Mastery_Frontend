import React, { useState } from 'react';
import {  Trash2 } from 'lucide-react';

// Confirmation Modal Component
const DeleteCommentModal = ({  onClose, onConfirm }) => {

    const handleDelete = () => {
        onConfirm();
        onClose();
      };




  return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Comment</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this comment? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
             onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
  );
};


export default DeleteCommentModal