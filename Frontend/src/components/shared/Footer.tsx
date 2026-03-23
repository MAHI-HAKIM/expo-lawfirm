"use client";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Scale,
  BookOpen,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";
import { useEffect, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

// Create a local AnimatedSection component to avoid import issues
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  delay = 0,
  direction = "up",
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const variants = {
    hidden: {
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      opacity: 0,
    },
    visible: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const practiceAreas = [
    { name: "Criminal Law", href: "/services/criminal-law" },
    { name: "Family Law", href: "/services/family-law" },
    { name: "Business Law", href: "/services/business-law" },
    { name: "Real Estate Law", href: "/services/real-estate-law" },
    { name: "Personal Injury", href: "/services/personal-injury" },
    { name: "Insurance Claims", href: "/services/insurance-claims" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Attorneys", href: "/team" },
    { name: "Case Results", href: "/cases" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Legal Resources", href: "/resources" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t border-[#333333]">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Legal Badges - Moved to top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 pb-10 border-b border-[#333333]">
          <AnimatedSection
            delay={0.1}
            className="flex flex-col items-center text-center"
          >
            <Scale className="w-12 h-12 text-[#b78c4e] mb-4" />
            <h4 className="font-bold text-white mb-2 text-lg">
              Legal Excellence
            </h4>
            <p className="text-gray-400 text-sm">
              Award-winning representation
            </p>
          </AnimatedSection>

          <AnimatedSection
            delay={0.2}
            className="flex flex-col items-center text-center"
          >
            <Shield className="w-12 h-12 text-[#b78c4e] mb-4" />
            <h4 className="font-bold text-white mb-2 text-lg">
              Client Protection
            </h4>
            <p className="text-gray-400 text-sm">
              Your rights are our priority
            </p>
          </AnimatedSection>

          <AnimatedSection
            delay={0.3}
            className="flex flex-col items-center text-center"
          >
            <BookOpen className="w-12 h-12 text-[#b78c4e] mb-4" />
            <h4 className="font-bold text-white mb-2 text-lg">
              Legal Expertise
            </h4>
            <p className="text-gray-400 text-sm">
              Decades of combined experience
            </p>
          </AnimatedSection>

          <AnimatedSection
            delay={0.4}
            className="flex flex-col items-center text-center"
          >
            <Users className="w-12 h-12 text-[#b78c4e] mb-4" />
            <h4 className="font-bold text-white mb-2 text-lg">
              Client Focused
            </h4>
            <p className="text-gray-400 text-sm">
              Personalized legal solutions
            </p>
          </AnimatedSection>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 mx-auto">
          {/* Company Info */}
          <AnimatedSection direction="left" delay={0.1} className="space-y-6">
            <Link href="/" className="flex items-center">
              <div className="relative h-12 w-12 mr-3">
                <Image
                  src="/logo.png"
                  alt="ExpoLaw Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-serif font-bold text-white">
                Expo<span className="text-[#b78c4e]">Law</span>
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Dedicated to providing exceptional legal representation with
              integrity and commitment. Our experienced attorneys are committed
              to achieving the best possible outcomes for our clients.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, link: "#" },
                { icon: Twitter, link: "#" },
                { icon: Instagram, link: "#" },
                { icon: Linkedin, link: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  className="bg-[#333333] hover:bg-[#b78c4e] text-white p-2.5 rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </AnimatedSection>

          {/* Practice Areas */}
          <AnimatedSection delay={0.2} className="space-y-6">
            <h3 className="text-xl font-bold relative inline-block">
              Practice Areas
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#b78c4e]"></span>
            </h3>
            <ul className="space-y-3 mt-2">
              {practiceAreas.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#b78c4e] flex items-center gap-2 w-fit 
                             group transition-all duration-300"
                  >
                    <ArrowRight className="w-0 h-4 opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100 text-[#b78c4e]" />
                    <span className="relative">
                      {item.name}
                      <span
                        className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#b78c4e] 
                                  transition-all duration-300 group-hover:w-full"
                      ></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Quick Links */}
          <AnimatedSection delay={0.3} className="space-y-6">
            <h3 className="text-xl font-bold relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#b78c4e]"></span>
            </h3>
            <ul className="space-y-3 mt-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#b78c4e] flex items-center gap-2 w-fit 
                             group transition-all duration-300"
                  >
                    <ArrowRight className="w-0 h-4 opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100 text-[#b78c4e]" />
                    <span className="relative">
                      {item.name}
                      <span
                        className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#b78c4e] 
                                  transition-all duration-300 group-hover:w-full"
                      ></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection direction="right" delay={0.4} className="space-y-6">
            <h3 className="text-xl font-bold relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#b78c4e]"></span>
            </h3>
            <ul className="space-y-4 mt-2">
              <li className="flex items-start group">
                <MapPin className="w-5 h-5 text-[#b78c4e] mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  1234 Justice Avenue, Suite 500
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center group">
                <Phone className="w-5 h-5 text-[#b78c4e] mr-3 flex-shrink-0" />
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  (212) 555-1234
                </span>
              </li>
              <li className="flex items-center group">
                <Mail className="w-5 h-5 text-[#b78c4e] mr-3 flex-shrink-0" />
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  contact@expolaw.com
                </span>
              </li>
            </ul>

            <div className="bg-[#212121] p-6 rounded-lg border border-[#333333] mt-6">
              <h4 className="font-bold mb-3 text-[#b78c4e] flex items-center">
                <Clock className="w-4 h-4 mr-2" /> Office Hours
              </h4>
              <div className="text-gray-300 space-y-5">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-[#333333] flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
            © {currentYear} ExpoLaw. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Link
              href="/privacy-policy"
              className="text-gray-400 hover:text-[#b78c4e] transition-colors duration-300 text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-400 hover:text-[#b78c4e] transition-colors duration-300 text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href="/disclaimer"
              className="text-gray-400 hover:text-[#b78c4e] transition-colors duration-300 text-sm"
            >
              Legal Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
