"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/ui/InputField";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

interface AuthFormProps<T> {
  type: "signup" | "signin";
  errorMessage?: string;
  onSubmit: (formData: T) => Promise<void>;
  initialFormData: T;
}

const AuthForm = <T extends Record<string, any>>({
  type,
  onSubmit,
  initialFormData,
  errorMessage,
}: AuthFormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      setErrors(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 font-serif">
          {type === "signup" ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="text-gray-400">
          {type === "signup"
            ? "Join our legal community today"
            : "Sign in to access your account"}
        </p>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/40 border border-red-500/50 rounded-md p-4 mb-6"
        >
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
            <p className="text-red-200 text-sm">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === "signup" && (
          <InputField
            label="Full Name"
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            error={errors.full_name}
            placeholder="Mahi Hakim"
            required
          />
        )}

        <InputField
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="john.doe@example.com"
          required
        />

        {type === "signup" && (
          <InputField
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+1 (555) 000-0000"
          />
        )}

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
          required
        />

        {type === "signup" && (
          <motion.div
            className="flex items-center p-4 rounded-md"
            whileHover={{ borderColor: "#b78c4e" }}
          >
            <input
              type="checkbox"
              id="isAttorney"
              name="isAttorney"
              checked={formData.isAttorney}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-[#b78c4e] border-[#333333] rounded focus:ring-[#b78c4e] bg-[#1a1a1a]"
            />
            <label htmlFor="isAttorney" className="ml-2 text-gray-300">
              I am an attorney
            </label>
          </motion.div>
        )}

        {type === "signup" && formData.isAttorney && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <InputField
              label="Bar Number"
              type="text"
              name="barNumber"
              value={formData.barNumber}
              onChange={handleChange}
              error={errors.barNumber}
              placeholder="Enter your bar number"
              required
            />
            <InputField
              label="Firm Name"
              type="text"
              name="firmName"
              value={formData.firmName}
              onChange={handleChange}
              error={errors.firmName}
              placeholder="Enter your firm name"
            />
          </motion.div>
        )}

        {type === "signin" && (
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-[#b78c4e]" />
              <span className="ml-2 text-sm text-gray-400">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[#b78c4e] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#b78c4e] text-white py-3 rounded-md hover:bg-[#9a7339] transition-colors duration-300"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Processing..."
            : type === "signup"
            ? "Create Account"
            : "Sign In"}
        </motion.button>

        <p className="text-center text-gray-400">
          {type === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Link
            href={type === "signup" ? "/signin" : "/signup"}
            className="text-[#b78c4e] hover:underline"
          >
            {type === "signup" ? "Sign in" : "Sign up"}
          </Link>
        </p>

        {type === "signup" && (
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-[#b78c4e] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#b78c4e] hover:underline">
              Privacy Policy
            </Link>
          </p>
        )}
      </form>
    </motion.div>
  );
};

export default AuthForm;
