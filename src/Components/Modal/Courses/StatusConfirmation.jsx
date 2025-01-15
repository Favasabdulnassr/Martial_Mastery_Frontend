import React from 'react'

function StatusConfirmation({action, handleConfirmAction, closeModal}) {
  return (
    <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">
            Are you sure you want to {action} this course?
          </h3>
          <p className="mb-4 text-gray-600">
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleConfirmAction}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Yes, {action}
            </button>
            <button
              onClick={closeModal}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              No, cancel
            </button>
          </div>
        </div>
  )
}

export default StatusConfirmation