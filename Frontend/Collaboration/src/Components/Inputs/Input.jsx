import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import React, { useState } from "react";

const Input = ({ value, onchange, label, placeholder, type , disabled }) => {
  const [showPassword, setShowPassword] = useState(false);

  const ToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col my-2 space-y-1.5">
      <label htmlFor="" className="font-medium">
        {label}
      </label>

      <div className="relative w-full">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          disabled={disabled}
          placeholder={placeholder}
          className="p-3 pr-10 bg-slate-50 border outline-none rounded-md w-full"
          value={value}
          onChange={(e) => onchange(e)}
          autoComplete={type === "email" ? "email" : "on"} 
          min="1"
        />

        {type === "password" && (
          <span
            onClick={ToggleShowPassword}
            className="absolute translate-y-1/2 right-3 cursor-pointer text-gray-600"
          >
            {showPassword ? (
              <FaRegEye size={22} />
            ) : (
              <FaRegEyeSlash size={22} />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
