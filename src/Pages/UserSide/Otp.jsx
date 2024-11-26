import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '@/services/constents';

const OTPVerificationPage = () => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const sessionId = localStorage.getItem('session_id')



  

  useEffect(() => {

    const expirationTime = localStorage.getItem('otpExpirationTime')
    console.log('expiiiiiiiiii', expirationTime)

    if (expirationTime) {
      const expirationTimestamp = new Date(expirationTime).getTime();
      console.log('exppppp', expirationTimestamp)
      const currentTime = new Date().getTime();
      console.log('current', currentTime)
      const remainingTime = Math.max(0, Math.floor((expirationTimestamp - currentTime) / 1000));
      console.log('remaa', remainingTime)
      setTimeLeft(remainingTime);


      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            localStorage.removeItem('otpExpirationTime');
            toast.error('OTP has expired.please request a new one');
            return 0;
          }
          return prevTime - 1
        });

      }, 1000);

      return () => clearInterval(timer); // Cleanup on component unmount

    }

  }, []);

  const handleOtpChange = (index, value) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Automatically move focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');

    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    try {
      // Simulated verification
      const response = await axios.post(`${BASE_URL}/auth/verify/`, { otp: otpCode, sessionId: sessionId },
      );

      toast.success(response.data.message);
      localStorage.removeItem('otpExpirationTime'); // Remove after successful submission
      localStorage.removeItem('session_id');
      navigate('/login');

    } catch (error) {


      // Handle error response
      if (error.response) {
        console.log(error, 'firstttttttttt')
        // Show the error message returned from the backend
        toast.error(error.response.data.error);
      } else {
        console.error(error, 'sssssseconondddddddddddd')
        // Handle other errors (e.g., network issues)
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move focus backwards
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-[#1a1a1a] rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500"
          >
            Verify OTP
          </motion.h1>
          <p className="text-gray-300 mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 text-center text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-xl"
                pattern="\d*"
                inputMode="numeric"
              />
            ))}
          </div>

          {/* Countdown Timer */}
          <div className="text-center mt-4">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-400">Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
            ) : (
              <p className="text-sm text-red-500">OTP expired</p>
            )}
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Didn't receive the code?
              <button
                type="button"
                className="ml-2 font-medium text-cyan-500 hover:text-cyan-700 hover:underline transition-colors"
              >
                Resend OTP
              </button>
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black p-3 rounded-lg hover:bg-cyan-500 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
          >
            Verify
            <ArrowRight size={20} />
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-cyan-500 hover:text-cyan-700 hover:underline transition-colors"
            >
              Back to Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerificationPage;