"use client";

import { useState } from "react";
import AuthForm from "./AuthForm";
import { SignInFormData } from "./types";
import { useRouter } from "next/navigation";
import { signIn } from "@/services/auth.service";
import toast from "react-hot-toast";

const SignInForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const initialFormData = {
    email: "",
    password: "",
  };

  const handleSubmit = async (formData: SignInFormData) => {
    try {
      const response = await signIn(formData);

      if (response.success) {
        // Show success message
        toast.success("Successfully logged in!");

        // Get user data from the response
        const userData = response.userData;

        // Redirect based on user role
        if (userData?.role === "admin") {
          router.push("/admin");
        } else if (userData?.role === "lawyer") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }

        // Force a refresh to update the UI with new auth state
        router.refresh();
      } else {
        setErrorMessage(response.error || "Login failed");
        toast.error(response.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <AuthForm<SignInFormData>
      type="signin"
      initialFormData={initialFormData}
      errorMessage={errorMessage}
      onSubmit={handleSubmit}
    />
  );
};

export default SignInForm;
