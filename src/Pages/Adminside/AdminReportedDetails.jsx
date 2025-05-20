import AdminSidebar from '@/Components/AdminSidebar'
import AdminTopbar from '@/Components/AdminTopbar'
import axiosInstance from '@/services/interceptor';
import { Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminReportedDetails() {
    const [reportDetails, setReportDetails] = useState([]);
    const [emailModal, setEmailModal] = useState(false);
    const [emailContent, setEmailContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {courseId} = useParams()

    useEffect(() => {
        const fetchReportDetails = async () => {
          try {
            console.log('ssssssssssssss',courseId);
            
            const response = await axiosInstance.get(`/adminside/course-reports/${courseId}/`);
            console.log('nnnnnnnnnnnnnnn',response.data);
            
            setReportDetails(response.data);
          } catch (error) {
            console.error('Error fetching report details', error);
          }
        };
    
        fetchReportDetails();
      }, [courseId]);
    
      const sendReportEmails = async () => {
        try {
          setIsSubmitting(true);
          await axiosInstance.post('send-report-emails/', {
            courseIds: courseId,
            emailContent
          });
          setEmailModal(false);
          setEmailContent('');
          toast.success('Email sent successfully')
        } catch (error) {
          console.error('Error sending emails', error);
        }finally{
          setIsSubmitting(false);
          setEmailModal(false);
        }
      };

      const handleModalClose = () => {
        setEmailModal(false);
        setEmailContent(''); // Clear content when modal is closed
    };

  return (
    <>
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar/>
      <div className='flex-1 lg:ml-80'>
        <AdminTopbar />

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Report Details</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Review reported content</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            {/* Mobile card view (displays under 768px) */}
            <div className="block md:hidden">
              {reportDetails.length === 0 ? (
                <div className="text-center p-4">No reports found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {reportDetails.map((report) => (
                    <div key={report.id} className="py-4 hover:bg-gray-50">
                      <div className="font-medium text-gray-900 mb-1">User: {report.student}</div>
                      <div className="text-sm">
                        <div className="text-gray-600 mb-1">
                          <span className="text-gray-500 font-medium">Reason: </span>{report.reason}
                        </div>
                        <div className="text-gray-600">
                          <span className="text-gray-500 font-medium">Details: </span>{report.details}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop table view (displays above 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">Reported Users</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {reportDetails.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center p-4">No reports found</td>
                    </tr>
                  ) : (
                    reportDetails.map((report) => (
                      <tr key={report.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{report.student}</td>
                        <td className="p-3">{report.reason}</td>
                        <td className="p-3">{report.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <button 
              onClick={() => setEmailModal(true)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <Mail className="mr-2 h-4 w-4" /> Send Emails
            </button>
          </div>
        </div>

        {emailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md sm:max-w-lg">
              <h3 className="text-lg font-semibold mb-4">Compose Email</h3>
              <textarea 
                className="w-full border rounded p-2 mb-4"
                rows={4}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Enter email content..."
              />
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button 
                  onClick={handleModalClose}
                  className="bg-gray-200 px-4 py-2 rounded order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button 
                  onClick={sendReportEmails}
                  disabled={isSubmitting}
                  className={`bg-green-600 text-white px-4 py-2 rounded order-1 sm:order-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div> 
    </>
  )
}

export default AdminReportedDetails