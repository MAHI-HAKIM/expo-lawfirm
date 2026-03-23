"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex">
      {/* Back to Home Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-white hover:text-[#b78c4e] transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </motion.div>

      {/* Left side - Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-[60%] relative">
        <Image
          src="/statueoflibrety.png"
          alt="Lady Justice"
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="relative z-10 flex items-center justify-center h-full p-12">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4 font-serif">ExpoLaw</h1>
            <p className="text-xl text-gray-300">
              Your trusted partner in legal excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 