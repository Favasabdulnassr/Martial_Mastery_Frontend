import AdminSidebar from '@/Components/AdminSidebar'
import AdminTopbar from '@/Components/AdminTopbar'
import axiosInstance from '@/services/interceptor';
import { Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdminReportedDetails() {
    const [reportDetails, setReportDetails] = useState([]);
    // const [selectedReports, setSelectedReports] = useState([]);
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
    

      // const handleReportSelection = (reportId) => {
      //   setSelectedReports(prev => 
      //     prev.includes(reportId)
      //       ? prev.filter(id => id !== reportId)
      //       : [...prev, reportId]
      //   );
      // };
    



      const sendReportEmails = async () => {
        try {
          setIsSubmitting(true);
          await axiosInstance.post('send-report-emails/', {
            courseIds: courseId,
            emailContent
          });
          setEmailModal(false);
          // setSelectedReports([]);
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

      <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Report Details</h2>
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            {/* <th className="p-3">
              <input 
                type="checkbox"
                checked={selectedReports.length === reportDetails.length}
                onChange={() => setSelectedReports(
                  selectedReports.length === reportDetails.length 
                    ? [] 
                    : reportDetails.map(report => report.id)
                )}
              />
            </th> */}
            <th className="p-3">Reported Users </th>
            <th className="p-3">Reason</th>
            <th className="p-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {reportDetails.map((report) => (
            <tr key={report.id} className="border-b">
              {/* <td className="p-3">
                <input 
                  type="checkbox"
                  checked={selectedReports.includes(report.id)}
                  onChange={() => handleReportSelection(report.id)}
                />
              </td> */}
              <td className="p-3">{report.student}</td>
              <td className="p-3">{report.reason}</td>
              <td className="p-3">{report.details}</td>
            </tr>
          ))}
        </tbody>
      </table>

     
        <button 
          onClick={() => setEmailModal(true)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Mail className="mr-2" /> Send Emails
        </button>

      {emailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-lg font-semibold mb-4">Compose Email</h3>
            <textarea 
              className="w-full border rounded p-2 mb-4"
              rows={4}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Enter email content..."
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={handleModalClose}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={sendReportEmails}
                disabled={isSubmitting}
                className={`bg-green-600 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}



    </div>




      </div>


    </div> 


</>
  )
}

export default AdminReportedDetails