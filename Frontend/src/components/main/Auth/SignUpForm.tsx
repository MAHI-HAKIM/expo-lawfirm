"use client";

import { useState } from "react";
import AuthForm from "./AuthForm";
import { SignUpFormData } from "./types";
import { registerUser, signIn } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignUpForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const initialFormData = {
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    barNumber: "",
    firmName: "",
    isAttorney: false,
  };

  const handleSubmit = async (formData: SignUpFormData) => {
    try {
      console.log("Form Data", formData);
      // Only send the fields that the backend expects
      const registrationData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        role: formData.isAttorney ? "lawyer" : "client",
      };

      // First register the user
      const registerResponse = await registerUser(registrationData);

      if (registerResponse.success) {
        // Show registration success message
        toast.success("Registration successful!");

        // Automatically sign in the user
        const signInResponse = await signIn({
          email: formData.email,
          password: formData.password,
        });

        if (signInResponse.success) {
          // Redirect based on role
          if (signInResponse.userData?.role === "lawyer") {
            router.push("/lawyer/dashboard");
          } else {
            router.push("/dashboard");
          }
        } else {
          toast.error(
            signInResponse.error || "Failed to sign in after registration"
          );
        }
      } else {
        toast.error(registerResponse.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <AuthForm<SignUpFormData>
      type="signup"
      initialFormData={initialFormData}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
    />
  );
};

export default SignUpForm;
