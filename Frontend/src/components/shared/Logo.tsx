import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface LogoProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled, isMenuOpen }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href="/"
      className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
    >
      {/* Image Container */}
      <div className="relative w-14 h-14 bg-amber-50/10 rounded-md flex items-center justify-center">
        {!imageError ? (
          <Image
            src="/logoBg.png"
            alt="Expolaw Logo"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 50px, 80px"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-2xl font-bold text-amber-500">E</span>
        )}
      </div>

      {/* Text Container */}
      <div className="flex font-serif items-baseline gap-1">
        {" "}
        {/* Reduced gap between text elements */}
        <span
          className={`text-2xl font-serif font-bold ${
            isScrolled || isMenuOpen ? "text-slate-800" : "text-slate-100"
          } whitespace-nowrap`}
        >
          Expo
        </span>
        <span className="text-2xl font-bold text-[#eaa84c]">Law</span>
      </div>
    </Link>
  );
};

export default Logo;
