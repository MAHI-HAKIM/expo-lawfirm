import React, { ReactNode } from "react";
import toast, { Toaster, ToastOptions } from "react-hot-toast";

interface ToastProviderProps {
  children: ReactNode;
}

// Custom toast options interface to add exitDuration
interface CustomToastOptions extends ToastOptions {
  exitDuration?: number;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  // Cast to any to allow custom properties that aren't in the type definitions
  const CustomToaster = Toaster as any;

  return (
    <>
      <CustomToaster
        position="top-center"
        containerStyle={{
          top: 20,
          right: 20,
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 4000,
          exitDuration: 1000,
          style: {
            padding: "10px 12px",
            borderRadius: "12px",
            background: "#FFFFFF",
            color: "#333333",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            border: "1px solid rgba(0,0,0,0.05)",
          },
          success: {
            style: {
              background: "#E6F4F1",
              color: "#0F5432",
              border: "1px solid #A3E4D7",
            },
          },
          error: {
            style: {
              background: "#FEF0F0",
              color: "#721C24",
              border: "1px solid #F5C6CB",
            },
          },
          loading: {
            style: {
              background: "#F0F4F8",
              color: "#1A365D",
              border: "1px solid #A0AEC0",
            },
          },
        }}
        // Custom enter and exit animations
        enter={{
          duration: 300,
          initial: { opacity: 0, translateY: -20 },
          animate: { opacity: 1, translateY: 0 },
        }}
        exit={{
          duration: 300,
          initial: { opacity: 1, translateX: 0 },
          animate: { opacity: 0, translateX: 100 },
        }}
      />

      {children}
    </>
  );
}

interface NotifyOptions {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  loading: (message: string, options?: ToastOptions) => string;
  custom: (message: string, options?: ToastOptions) => string;
}

// Utility functions for more controlled toasting
export const notify: NotifyOptions = {
  success: (message, options = {}) =>
    toast.success(message, {
      ...options,
      icon: "✅",
      style: {
        background: "#E6F4F1",
        color: "#0F5132",
        border: "1px solid #A3E4D7",
      },
    }),

  error: (message, options = {}) =>
    toast.error(message, {
      ...options,
      icon: "❌",
      style: {
        background: "#FEF0F0",
        color: "#721C24",
        border: "1px solid #F5C6CB",
      },
    }),

  loading: (message, options = {}) =>
    toast.loading(message, {
      ...options,
      style: {
        background: "#F0F4F8",
        color: "#1A365D",
        border: "1px solid #A0AEC0",
      },
    }),

  custom: (message, options = {}) =>
    toast(message, {
      ...options,
      style: {
        background: "#FFFFFF",
        color: "#333333",
        border: "1px solid rgba(0,0,0,0.1)",
      },
    }),
};
