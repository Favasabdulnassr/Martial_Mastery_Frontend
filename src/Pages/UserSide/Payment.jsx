import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 120 }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.3, duration: 0.5 }
    }
  };

  const renderContent = () => {
    if (success) {
      return (
        <div className="text-center">
          <motion.div 
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 sm:mb-6"
          >
            <Check className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto" />
          </motion.div>
          <motion.div variants={textVariants}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-sm sm:text-base text-zinc-400">Thank you for your purchase.</p>
            <p className="text-xs sm:text-sm text-zinc-400 mt-4">
              <span className="inline-flex items-center">
                Redirecting to your courses...
                <Loader2 className="ml-2 w-3 h-3 animate-spin" />
              </span>
            </p>
          </motion.div>
        </div>
      );
    }

    if (cancel) {
      return (
        <div className="text-center">
          <motion.div 
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 sm:mb-6"
          >
            <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto" />
          </motion.div>
          <motion.div variants={textVariants}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Payment Failed</h2>
            <p className="text-sm sm:text-base text-zinc-400">Something went wrong with your payment.</p>
            <p className="text-xs sm:text-sm text-zinc-400 mt-4">
              <span className="inline-flex items-center">
                Redirecting to courses page...
                <Loader2 className="ml-2 w-3 h-3 animate-spin" />
              </span>
            </p>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <motion.div 
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          className="mb-4 sm:mb-6"
        >
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 mx-auto animate-spin" />
        </motion.div>
        <motion.div variants={textVariants}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Processing Payment</h2>
          <p className="text-sm sm:text-base text-zinc-400">Please wait while we confirm your payment...</p>
        </motion.div>
      </div>
    );
  };

  // Progress bar animation for countdown
  const [progress, setProgress] = React.useState(100);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) return 0;
        return prev - (100/30); // Smooth decrease over 3 seconds (30 frames at 100ms)
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-zinc-900 flex items-center justify-center px-4 sm:px-6 py-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-zinc-900 p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full border border-zinc-800"
      >
        {renderContent()}
        
        {/* Animated progress bar */}
        <div className="mt-8 sm:mt-10 w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
            className={`h-full ${success ? 'bg-green-500' : cancel ? 'bg-red-500' : 'bg-cyan-400'}`}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentStatus;