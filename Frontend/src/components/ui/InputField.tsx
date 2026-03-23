"use client";

import { motion } from "framer-motion";
import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export default function InputField({
  label,
  type,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}: InputFieldProps) {
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-gray-300 mb-2" htmlFor={name}>
        {label} {required && <span className="text-[#b78c4e]">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-[#212121] border ${
          error ? "border-red-500" : "border-[#333333]"
        } rounded-md text-white focus:outline-none focus:border-[#b78c4e] transition-colors duration-300`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
