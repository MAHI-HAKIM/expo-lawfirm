"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../Logo";
import NavbarLinks from "./NavbarLinks";
import MobileMenu from "./MobileMenu";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const navItems: string[] = ["Home", "About", "Projects", "Markets", "Contact"];

const ClientNavbar: React.FC = () => {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Logo isScrolled={isScrolled} isMenuOpen={isMenuOpen} />

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavbarLinks
              isScrolled={isScrolled}
              isMenuOpen={isMenuOpen}
              navItems={navItems}
              pathname={pathname}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${
                isScrolled || isMenuOpen ? "text-gray-900" : "text-[#eaa84c]"
              } hover:text-[#eaa84c] p-2 rounded-md`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally Render Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            navItems={navItems}
            pathname={pathname}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ClientNavbar;
