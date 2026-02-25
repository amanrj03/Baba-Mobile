import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../components/FloatingInput";
import { authAPI } from "../services/api";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Core validation logic for both real-time and blur events
  const validateField = (name, value) => {
    let errorMsg = "";
    const val = value ? value.trim() : "";

    // General Fields
    if (
      !val &&
      [
        "firstName",
        "lastName",
        "email",
        "password",
        "confirmPassword",
      ].includes(name)
    ) {
      if (name === "firstName") errorMsg = "Please enter your first name.";
      else if (name === "lastName") errorMsg = "Please enter your last name.";
      else if (name === "email") errorMsg = "Email address not valid.";
      else errorMsg = "This field is required.";

      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
      return;
    }

    // Specific Validation Logic
    if (name === "email" && val && !/\S+@\S+\.\S+/.test(val)) {
      errorMsg = "Email address not valid.";
    } else if (name === "password" && val && val.length < 8) {
      errorMsg = "Use 8 or more characters.";
    } else if (name === "confirmPassword" && val !== formData.password) {
      errorMsg = "Passwords do not match.";
    }

    // Consolidated Date of Birth Logic
    if (["day", "month", "year"].includes(name)) {
      const d = name === "day" ? val : formData.day;
      const m = name === "month" ? val : formData.month;
      const y = name === "year" ? val : formData.year;

      if (!d || !m || !y) {
        errorMsg = "Please enter a valid date of birth.";
      } else {
        errorMsg = ""; // Clear DOB error if all three have values
      }
      setErrors((prev) => ({ ...prev, dob: errorMsg }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // If there's already an error, update it in real-time as they fix it
    if (errors[field]) validateField(field, value);
  };

  const handleBlur = (field, value) => {
    validateField(field, value); // Triggers red error if left empty
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields first
    const newErrors = {};
    
    // Check email
    if (!formData.email.trim()) {
      newErrors.email = "Email address not valid.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address not valid.";
    }
    
    // Check password
    if (!formData.password) {
      newErrors.password = "This field is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Use 8 or more characters.";
    }
    
    // Check confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "This field is required.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    
    // Check first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Please enter your first name.";
    }
    
    // Check last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Please enter your last name.";
    }
    
    // Check date of birth
    if (!formData.day || !formData.month || !formData.year) {
      newErrors.dob = "Please enter a valid date of birth.";
    }
    
    // If there are errors, set them and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      // Send OTP to email
      await authAPI.sendOTP(formData.email);
      
      // Store form data in sessionStorage for later use
      sessionStorage.setItem('signupData', JSON.stringify(formData));
      
      // Navigate to verify page
      navigate('/verify');
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMsg = error.response?.data?.error || 'Failed to send OTP. Please try again.';
      setErrors({ email: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center justify-center px-4 py-12 font-sans">
      {/* Centered Heading */}
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center w-full">
        Baba Account
      </h2>

      {/* Main Card */}
      <div className="w-full max-w-[540px] bg-white rounded-[32px] shadow-xl p-8 md:p-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create your account
        </h1>
        <p className="text-gray-500 text-sm mb-10 leading-relaxed">
          Enter your details below to create your account. Or{" "}
          <span className="text-indigo-600 cursor-pointer hover:underline">
            click here to use your phone number instead
          </span>
        </p>

        <form
          autoComplete="off"
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <FloatingInput
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={(e) => handleBlur("email", e.target.value)}
            error={errors.email}
          />

          <div className="relative">
            <FloatingInput
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={(e) => handleBlur("password", e.target.value)}
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <FloatingInput
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingInput
              label="First name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={(e) => handleBlur("firstName", e.target.value)}
              error={errors.firstName}
            />
            <FloatingInput
              label="Last name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={(e) => handleBlur("lastName", e.target.value)}
              error={errors.lastName}
            />
          </div>

          {/* Consolidated Date of Birth Section */}
          <div className="w-full">
            <div className="grid grid-cols-3 gap-4 items-end">
              <FloatingInput
                label="Day"
                value={formData.day}
                onChange={(e) => handleChange("day", e.target.value)}
                onBlur={(e) => handleBlur("day", e.target.value)}
                // Force the red color using className
                className={errors.dob ? "border-red-500" : ""}
              />

              <div className="mb-6">
                <div
                  className={`relative border-b transition-all duration-200 ${
                    errors.dob
                      ? "border-red-500"
                      : "border-gray-300 focus-within:border-indigo-600"
                  }`}
                >
                  <label
                    className={`absolute left-0 transition-all duration-200 pointer-events-none uppercase tracking-wider font-bold 
          ${formData.month ? "top-[-14px] text-[10px]" : "top-2 text-sm font-normal"} 
          ${errors.dob ? "text-red-500" : "text-gray-500"}`}
                  >
                    Month
                  </label>
                  <select
                    className="w-full py-2 bg-transparent outline-none text-gray-900 text-sm appearance-none cursor-pointer"
                    value={formData.month}
                    onChange={(e) => handleChange("month", e.target.value)}
                    onBlur={(e) => handleBlur("month", e.target.value)}
                  >
                    <option value="" disabled></option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <div className="absolute right-0 top-3 pointer-events-none text-gray-400 text-[10px]">
                    ▼
                  </div>
                </div>
              </div>

              <FloatingInput
                label="Year"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                onBlur={(e) => handleBlur("year", e.target.value)}
                className={errors.dob ? "border-red-500" : ""}
              />
            </div>

            {/* Single Error Message */}
            <div className="h-5 -mt-4">
              {errors.dob && (
                <p className="text-[11px] text-red-500 font-medium leading-none">
                  {errors.dob}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-10">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex-1 bg-[#eeeeee] hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-full transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#004795] hover:bg-black text-white font-bold py-3.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Next'}
            </button>
          </div>
        </form>
      </div>

      <footer className="w-full py-8 text-center text-gray-500">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-medium">
          <a href="#" className="hover:underline">
            Terms and Conditions
          </a>
          <a href="#" className="hover:underline">
            Privacy Notice
          </a>
          <a href="#" className="hover:underline">
            Contact us
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
