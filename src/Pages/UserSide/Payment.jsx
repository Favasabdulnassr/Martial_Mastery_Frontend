import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, XCircle, Loader2 } from 'lucide-react';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get('success') === 'true';
  const cancel = queryParams.get('cancel') === 'true';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (success) {
        navigate('/purchased-courses', { replace: true });
      } else if (cancel) {
        navigate('/courses', { replace: true });
      }
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer); // Cleanup timeout
  }, [success, cancel, navigate]);

  const renderContent = () => {
    if (success) {
      return (
        <div className="text-center">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-zinc-400">Thank you for your purchase.</p>
          <p className="text-zinc-400 mt-4">Redirecting to your courses...</p>
        </div>
      );
    }

    if (cancel) {
      return (
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
          <p className="text-zinc-400">Something went wrong with your payment.</p>
          <p className="text-zinc-400 mt-4">Redirecting to courses page...</p>
        </div>
      );
    }

    return (
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
        <p className="text-zinc-400">Please wait while we confirm your payment...</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentStatus;
