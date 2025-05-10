import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '@/services/constents';
import { useSelector } from 'react-redux';

const OTPVerificationPage = () => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const sessionId = localStorage.getItem('session_id');

  const {isAuthenticated, role} = useSelector((state) => state.login);

  useEffect(() => {
    if(role === 'admin') {
        navigate('/admin/dashboard');
    }
    else if(role === 'tutor') {
      navigate('/tutor/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    const expirationTime = localStorage.getItem('otpExpirationTime');
    
    if (expirationTime) {
      const expirationTimestamp = new Date(expirationTime).getTime();
      const currentTime = expirationTimestamp - 90000;
      const remainingTime = 85;
      setTimeLeft(remainingTime);

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            localStorage.removeItem('otpExpirationTime');
            toast.error('OTP has expired. Please request a new one');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup on component unmount
    }
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
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
      const response = await axios.post(`${BASE_URL}/auth/verify/`, { 
        otp: otpCode, 
        sessionId: sessionId 
      });

      toast.success(response.data.message);
      localStorage.removeItem('otpExpirationTime');
      localStorage.removeItem('session_id');
      navigate('/login');

    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
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

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only process if it's a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtpDigits = pastedData.split('');
      setOtpDigits(newOtpDigits);
      
      // Focus on the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-400 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1a1a1a] rounded-xl shadow-xl p-4 sm:p-6 md:p-8 transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-500">
            Verify OTP
          </h1>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">Enter the 6-digit code sent to your email</p>
        </div>

        <form onSubmit={handleOtpSubmit} className="space-y-4 sm:space-y-6">
          <div className="flex justify-center gap-1 sm:gap-2" onPaste={handlePaste}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-8 h-10 sm:w-10 sm:h-12 text-center text-white bg-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg sm:text-xl"
                pattern="\d*"
                inputMode="numeric"
                aria-label={`Digit ${index + 1} of OTP`}
              />
            ))}
          </div>

          {/* Countdown Timer */}
          <div className="text-center mt-2 sm:mt-4">
            {timeLeft > 0 ? (
              <p className="text-xs sm:text-sm text-gray-400">Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
            ) : (
              <p className="text-xs sm:text-sm text-red-500">OTP expired</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-black p-2 sm:p-3 rounded-lg hover:bg-cyan-500 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Verify
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-cyan-500 hover:text-cyan-700 hover:underline transition-colors"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;