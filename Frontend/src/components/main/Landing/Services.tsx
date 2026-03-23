"use client";

import { Scale, Briefcase, BookOpen, Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import ServiceCards from "./ServiceCards";

interface Service {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const services: Service[] = [
  {
    title: "Criminal Law",
    subtitle: "Defending Your Rights",
    description:
      "Our experienced criminal defense attorneys provide aggressive representation for those facing criminal charges.",
    image: "/crimeScene.png",
  },
  {
    title: "Family Law",
    subtitle: "Compassionate Legal Support",
    description:
      "Guiding families through divorce, custody, and other sensitive legal matters with empathy and expertise.",
    image: "/familylaw.png",
  },
  {
    title: "Business Law",
    subtitle: "Corporate Legal Solutions",
    description:
      "Comprehensive legal services for businesses of all sizes, from startups to established corporations.",
    image: "/businesslaw.png",
  },
  {
    title: "Real Estate Law",
    subtitle: "Property Transaction Expertise",
    description:
      "Navigating complex property transactions, disputes, and development projects with precision.",
    image: "/realestatelaw.png",
  },
  {
    title: "Insurance Claims",
    subtitle: "Maximizing Your Recovery",
    description:
      "We help clients navigate complex insurance claims and disputes, ensuring they receive the coverage they deserve.",
    image: "/insurance.png",
  },
];

const Services: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden" id="services" ref={ref}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#b78c4e] font-medium tracking-wider mb-3">/ OUR SERVICES</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif">
            Legal Services We <span className="text-[#b78c4e]">Provide</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Comprehensive legal solutions tailored to your specific needs. Our experienced team is here to guide you through every step of your legal journey.
          </p>
        </motion.div>

        <ServiceCards services={services} />

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#b78c4e] text-white rounded-md hover:bg-[#9a7339] transition-colors duration-300 font-medium"
          >
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;