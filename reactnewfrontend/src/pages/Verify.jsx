import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FloatingInput from '../components/FloatingInput';
import { authAPI } from '../services/api';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  
  useEffect(() => {
    // Get signup data from sessionStorage
    const signupData = sessionStorage.getItem('signupData');
    if (!signupData) {
      navigate('/signup');
      return;
    }
    const data = JSON.parse(signupData);
    setEmail(data.email);
  }, [navigate]);

  // Real-time and Blur validation logic
  const validateOtp = (value) => {
    let errorMsg = "";
    const val = value ? value.trim() : "";

    if (!val) {
      errorMsg = "Please enter the verification code.";
    } else if (val.length < 6 || isNaN(val)) {
      errorMsg = "Verification codes contain 6 numbers.";
    }

    setError(errorMsg);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      // Clear or update error in real-time if one already exists
      if (error) validateOtp(value);
    }
  };

  const handleBlur = () => {
    validateOtp(otp); // Trigger red error if field is left empty or incomplete
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      validateOtp(otp);
      return;
    }
    
    setLoading(true);
    try {
      // Verify OTP
      await authAPI.verifyOTP(otp);
      
      // Get signup data
      const signupData = JSON.parse(sessionStorage.getItem('signupData'));
      
      // Register user
      const registerData = {
        username: signupData.email.split('@')[0], // Use email prefix as username
        email: signupData.email,
        password: signupData.password,
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        date_of_birth: `${signupData.year}-${signupData.month.padStart(2, '0')}-${signupData.day.padStart(2, '0')}`,
      };
      
      await authAPI.register(registerData);
      
      // Clear session storage
      sessionStorage.removeItem('signupData');
      
      // Navigate to login
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      const errorMsg = error.response?.data?.error || 'Invalid or expired OTP. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await authAPI.resendOTP();
      alert('OTP resent successfully!');
      setError(null);
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center px-4 font-sans">
      
      {/* Centered Heading above box */}
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center w-full">
        Baba Account
      </h2>

      {/* Main Verification Card */}
      <div className="w-full max-w-[448px] bg-white rounded-[32px] shadow-xl p-10 md:p-14 mb-8">
        
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Verify your account
          </h1>
          <p className="text-gray-900 font-bold text-sm mt-4">
            {email}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <FloatingInput 
            label="Verification code" 
            value={otp}
            onChange={handleChange}
            onBlur={handleBlur}
            error={error} // Displays red border and message
            type="text"
            inputMode="numeric"
          />

          {/* Action Buttons */}
          <div className="flex gap-4 mt-10">
            <button 
              type="button"
              onClick={() => navigate('/signup')}
              className="flex-1 bg-[#eeeeee] hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-full transition-colors"
            >
              Back
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#004795] hover:bg-black text-white font-bold py-3.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Next'}
            </button>
          </div>
        </form>

        {/* Resend link matching the Samsung style */}
        <div className="mt-8 text-center">
          <button 
            onClick={handleResend}
            disabled={loading}
            className="text-indigo-600 text-sm font-medium hover:underline disabled:opacity-50"
          >
            Resend code
          </button>
        </div>
      </div>

      <footer className="w-full py-8 text-center text-gray-500">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-medium mb-4">
          <a href="#" className="hover:underline">Terms and Conditions</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Contact us</a>
        </div>
        <p className="text-[10px] text-gray-400">
          Copyright © 1995-2026 Baba Mobiles. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default VerifyAccount;