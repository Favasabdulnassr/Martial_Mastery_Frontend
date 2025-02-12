import React from 'react'

function ReportModal({ course, onClose, onSubmit, isSubmitting }) {
    const [reason, setReason] = React.useState('');
    const [otherDetails, setOtherDetails] = React.useState('');
    const REPORT_REASONS = [
        { value: 'inappropriate', label: 'Inappropriate Content' },
        { value: 'misleading', label: 'Misleading Description' },
        { value: 'quality', label: 'Poor Quality' },
        { value: 'other', label: 'Other' }
    ];

    
  const handleSubmit = async () => {
    const reportData = {
      course: course?.id,
      reason:reason,
      details:reason === 'other'? details:'',
      tutorId: course?.tutor_id
    };
    
    await onSubmit(reportData);
  };


    return (
        <div className="bg-zinc-900 p-8 rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-white">
                Report Course: {course?.course_title}
            </h2>
            <div className="mb-4">
                <label className="block text-zinc-300 mb-2">
                    Reason for Reporting
                </label>
                <select
                    value={reason}
                    onChange={(e)=>setReason(e.target.value)}
                    className="w-full bg-zinc-800 text-white rounded-lg p-2"
                >
                    <option value="">Select Reason</option>
                   {REPORT_REASONS.map(({value,label})=>(
                    <option key={value} value={value}>
                        {label}

                    </option>
                   ))}
                </select>
            </div>
            {reason === 'other' && (
                <textarea
                    value={otherDetails}
                    onChange={(e) => setOtherDetails(e.target.value)}
                    placeholder="Please provide more details"
                    className="w-full bg-zinc-800 text-white rounded-lg p-2 mb-4"
                    rows="4"
                />
            )}
            <div className="flex space-x-4">
                <button
                    
                    onClick={handleSubmit}
                    disabled={!reason||isSubmitting}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg 
                  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 bg-zinc-700 text-white py-2 rounded-lg"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ReportModal