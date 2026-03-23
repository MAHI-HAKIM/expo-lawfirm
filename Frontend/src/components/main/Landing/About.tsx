"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-20 bg-[#212121] text-white overflow-hidden" id="about" ref={ref}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="relative rounded-lg overflow-hidden"
              whileHover={{ scale: 1.03 }}
            >
              <Image
                src="/expertsolution.png"
                alt="Expert Legal Solutions"
                width={600}
                height={700}
                className="rounded-lg shadow-xl object-cover w-full h-auto"
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div
              className="absolute bottom-4 right-4 md:-bottom-6 md:-right-6 bg-[#b78c4e] p-4 rounded-lg shadow-lg"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <p className="text-lg font-bold text-white">
                20+ Years
              </p>
              <p className="text-sm text-white/80">Of Experience</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#b78c4e] font-medium tracking-wider mb-3">/ ABOUT OUR COMPANY</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
              Expert Legal Solutions for
              <br />
              <span className="text-[#b78c4e]">Complex Issues</span>
            </h2>

            <p className="text-gray-300 mb-8 leading-relaxed">
              Are you looking for information on a specific area of law such as
              criminal law, family law, etc? Our experienced attorneys provide
              comprehensive legal services tailored to your unique needs.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <motion.div 
                className="flex flex-col bg-[#1a1a1a] rounded-lg border border-[#333333] overflow-hidden" 
                whileHover={{ y: -5, borderColor: "#b78c4e" }}
              >
                <div className="h-24 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-[#2a2a2a] text-[#b78c4e]"
                    whileHover={{ backgroundColor: "#b78c4e", color: "white", scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Building2 className="h-8 w-8" />
                  </motion.div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-[#b78c4e]">Civil Partnership</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Expert guidance for civil partnerships and related legal
                    matters.
                  </p>
                  <Link 
                    href="/services/civil-partnership"
                    className="text-[#b78c4e] text-sm font-medium inline-flex items-center group"
                  >
                    Learn More 
                    <motion.span
                      className="ml-1"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-col bg-[#1a1a1a] rounded-lg border border-[#333333] overflow-hidden" 
                whileHover={{ y: -5, borderColor: "#b78c4e" }}
              >
                <div className="h-24 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-[#2a2a2a] text-[#b78c4e]"
                    whileHover={{ backgroundColor: "#b78c4e", color: "white", scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Shield className="h-8 w-8" />
                  </motion.div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 text-[#b78c4e]">Legal Consultation</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Professional advice on your legal rights, case, options, and
                    aproach strategies.
                  </p>
                  <Link 
                    href="/services/legal-consultation"
                    className="text-[#b78c4e] text-sm font-medium inline-flex items-center group"
                  >
                    Learn More 
                    <motion.span
                      className="ml-1"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="flex items-center mb-8 bg-[#1a1a1a] p-5 rounded-lg border border-[#333333]"
              whileHover={{ y: -5, borderColor: "#b78c4e" }}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
              >
                <Image
                  src="/Mahi-BlackBackground.jpg"
                  alt="CEO"
                  width={80}
                  height={80}
                  className="rounded-full mr-4"
                  style={{ border: "2px solid #b78c4e" }}
                />
              </motion.div>
              <div>
                <h4 className="font-bold text-white">Mahi Mohammed</h4>
                <p className="text-sm text-gray-300">CEO & Co-Founder</p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/about" 
                className="inline-flex h-14 bg-[#b78c4e] text-white px-8 rounded-md hover:bg-[#9a7339] transition-all duration-300 items-center justify-center font-medium"
              >
                Learn More About Us
                <motion.span
                  className="inline-block ml-2"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
