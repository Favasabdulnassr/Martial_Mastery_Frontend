import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <Card className="bg-white border-gray-200 w-full max-w-md shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-800">
          <AlertTriangle className="w-6 h-6 text-amber-500 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfirmationModal;