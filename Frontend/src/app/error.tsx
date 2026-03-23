"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { RefreshCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={80}
            className="mx-auto mb-8"
          />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif"
        >
          Oops! Something went <span className="text-[#b78c4e]">wrong</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-400 text-lg mb-8"
        >
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or return to the homepage.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center space-x-4"
        >
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-[#b78c4e] text-white rounded-md hover:bg-[#9a7339] transition-all duration-300 group"
          >
            <RefreshCcw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-[#b78c4e] text-[#b78c4e] rounded-md hover:bg-[#b78c4e] hover:text-white transition-all duration-300"
          >
            <Home className="w-5 h-5 mr-2" />
            Homepage
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
