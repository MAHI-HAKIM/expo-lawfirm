import { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/auth-bg.jpg"
          alt="Law firm background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
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