import React, { useState } from 'react';

const FloatingInput = ({ label, type = "text", error, value, onChange, onBlur, className, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || (value && value.length > 0);

  return (
    <div className={`mb-6 w-full ${className}`}>
      {/* Added 'border-red-500' check to the wrapper div */}
      <div className={`relative border-b transition-all duration-200 ${
        error || className?.includes('border-red-500') ? 'border-red-500' : isFocused ? 'border-indigo-600' : 'border-gray-300'
      }`}>
        
        <label
          className={`absolute left-0 transition-all duration-200 pointer-events-none uppercase tracking-wider font-bold
            ${isFloating ? 'top-[-14px] text-[10px]' : 'top-2 text-sm text-gray-400 font-normal'} 
            ${error || className?.includes('border-red-500') ? 'text-red-500' : isFocused ? 'text-indigo-600' : 'text-gray-500'}`}
        >
          {label}
        </label>

        <input
          {...props}
          type={type}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onChange={onChange}
          className="w-full py-2 bg-transparent outline-none text-gray-900 text-sm"
          placeholder=" " 
        />
      </div>
      
      {/* Only show text if the error prop contains an actual message */}
      {error && error !== " " && (
        <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
export default FloatingInput;