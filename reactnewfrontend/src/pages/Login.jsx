import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import FloatingInput from '../components/FloatingInput';
import { authAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Small delay to unlock the field after the browser's initial autofill sweep
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Validation logic
  const validateField = (name, value) => {
    let errorMsg = "";
    const val = value ? value.trim() : "";

    if (!val) {
      if (name === 'email') errorMsg = "Email address not valid.";
      else if (name === 'password') errorMsg = "Please enter your password.";
    } else if (name === 'email' && !/\S+@\S+\.\S+/.test(val)) {
      // Basic email check, though your reference also handles phone numbers
      errorMsg = "Email address not valid.";
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (name, value) => {
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    
    // Clear or update error in real-time if an error already exists
    if (errors[name]) validateField(name, value);
  };

  const handleBlur = (name, value) => {
    validateField(name, value); // Triggers red error if left empty
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fields
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email address not valid.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address not valid.";
    }
    
    if (!password) {
      newErrors.password = "Please enter your password.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      // Login with username (email prefix) and password
      const username = email.split('@')[0];
      const response = await authAPI.login({ username, password });
      
      // Store token and user data
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Get user profile
      const profileResponse = await authAPI.getProfile();
      localStorage.setItem('user', JSON.stringify(profileResponse.data));
      
      // Dispatch custom event to update navbar
      window.dispatchEvent(new Event('authChange'));
      
      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.detail || 'Invalid email or password';
      setErrors({ email: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f4f4] flex flex-col items-center justify-center px-4 font-sans">
      <div className="w-full max-w-[448px] flex flex-col items-center">
        
        {/* Centered Heading */}
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center w-full">
          Baba Account
        </h2>

        <div className="w-full bg-white rounded-[32px] shadow-xl p-10 md:p-14 mb-8">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              One account. Any device.<br />
              Just for you.
            </h1>
            <p className="text-gray-500 text-sm mt-2">Sign in to get started</p>
          </div>

          <form autoComplete="off" className="space-y-4" onSubmit={handleSubmit}>
            {/* Honeypot fields to distract the browser */}
            <input type="text" name="prevent_autofill" style={{display:'none'}} />
            <input type="password" name="password_fake" style={{display:'none'}} />

            <FloatingInput 
              label="Phone number or email" 
              value={email} 
              name="baba_identity_field_secure" 
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={(e) => handleBlur('email', email)}
              error={errors.email} // Triggers red border and message
              readOnly={!isReady}
              onFocus={(e) => e.target.removeAttribute('readonly')}
              autoComplete="new-password" 
            />

            <div className="relative">
              <FloatingInput 
                label="Password" 
                name="baba_secret_key"
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={(e) => handleBlur('password', password)}
                error={errors.password} // Triggers red border and message
                autoComplete="new-password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-2 p-1 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#004795] hover:bg-indigo-900 text-white font-bold py-3.5 rounded-full transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Next'}
            </button>
          </form>

          <div className="flex flex-col items-center gap-4 mt-8">
            <Link to="/signup" className="text-gray-600 text-sm font-medium hover:underline">
              Create account
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <button className="w-full bg-[#eeeeee] hover:bg-gray-200 flex items-center justify-center gap-3 py-3 rounded-full transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span className="text-gray-700 font-bold text-sm">Sign in with Google</span>
            </button>
          </div>
        </div>
      </div>

      <footer className="w-full py-8 text-center text-gray-500">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-medium mb-4">
          <a href="#" className="hover:underline">Terms and Conditions</a>
          <a href="#" className="hover:underline">Baba account Privacy Notice</a>
          <a href="#" className="hover:underline">Notice</a>
          <a href="#" className="hover:underline">Contact us</a>
        </div>
        <p className="text-[10px] text-gray-400">
          Copyright © 1995-2026 Baba Mobiles. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Login;