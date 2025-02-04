import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfirmationModal;