"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface NavbarLinksProps {
  isScrolled: boolean;
  isMenuOpen: boolean;
  navItems: string[];
  pathname: string;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({
  isScrolled,
  isMenuOpen,
  navItems,
  pathname,
}) => {
  return (
    <div className="hidden lg:block">
      <div className="ml-10 flex items-center space-x-4 relative">
        {navItems.map((item) => {
          const itemPath =
            item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;
          const isActive = pathname === itemPath;

          return (
            <Link
              href={itemPath}
              key={item}
              className={`relative px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                isScrolled || isMenuOpen
                  ? "text-gray-900 hover:text-[#eaa84c]"
                  : "text-white"
              }`}
            >
              <span className="relative z-10">{item}</span>
              {isActive && (
                <motion.div
                  layoutId="active-underline"
                  className="absolute left-0 bottom-0 w-full h-0.5 bg-[#eaa84c]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          );
        })}

        {/* Get Started Button */}
        <Link
          href="/signin"
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-300 relative overflow-hidden ${
            isScrolled || isMenuOpen
              ? "bg-[#eaa84c] text-white hover:bg-[#8d652f]"
              : "bg-[#eaa84c] text-white hover:bg-[#8d652f] hover:text-white bg-opacity-85"
          }`}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default NavbarLinks;
