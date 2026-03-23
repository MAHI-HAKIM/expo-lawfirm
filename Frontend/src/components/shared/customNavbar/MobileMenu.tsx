import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: string[];
  pathname: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navItems, pathname }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-white overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg border-t border-gray-100">
            {navItems.map((item) => {
              const itemPath =
                item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;
              const isActive = pathname === itemPath;

              return (
                <Link
                  key={item}
                  href={itemPath}
                  className={`text-gray-900  hover:bg-[#eaa84c]/60 block px-3 py-2 rounded-md text-center font-medium ${
                    isActive ? "bg-[#fad8a8]/40" : ""
                  }`}
                  onClick={() => {
                    onClose();
                    document
                      .getElementById(item.toLowerCase())
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                >
                  {item}
                </Link>
              );
            })}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-5">
                <Link
                  href="/signin"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-[#eaa84c] rounded-md hover:bg-[#845e29]"
                  onClick={onClose}
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
