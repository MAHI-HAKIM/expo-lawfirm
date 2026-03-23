"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

interface CaseStudy {
  id: number;
  title: string;
  category: string;
  image: string;
  link: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Corporate Fraud Investigation",
    category: "Business Law",
    image: "/corporatefraud.png",
    link: "/cases/corporate-fraud",
  },
  {
    id: 2,
    title: "Family Custody Resolution",
    category: "Family Law",
    image: "/familycustody.png",
    link: "/cases/family-custody",
  },
  {
    id: 3,
    title: "Insurance Claim Settlement",
    category: "Insurance Law",
    image: "/insuranceclaim.png",
    link: "/cases/insurance-claim",
  },
  {
    id: 4,
    title: "Criminal Defense Success",
    category: "Criminal Law",
    image: "/criminaldefence.png",
    link: "/cases/criminal-defense",
  },
];

const CaseStudies: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden" id="case-studies" ref={ref}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#b78c4e] font-medium tracking-wider mb-3">/ CASE STUDIES</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif">
            Our <span className="text-[#b78c4e]">Success Stories</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Explore our recent case studies to see how we&apos;ve helped clients achieve successful outcomes in various legal matters.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {caseStudies.map((caseStudy) => (
            <motion.div
              key={caseStudy.id}
              variants={itemVariants}
              className="bg-[#212121] rounded-lg overflow-hidden border border-[#333333] hover:border-[#b78c4e] transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={caseStudy.image}
                  alt={caseStudy.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-[#b78c4e] text-sm font-medium">
                  {caseStudy.category}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-4">{caseStudy.title}</h3>
                <Link
                  href={caseStudy.link}
                  className="inline-flex items-center text-[#b78c4e] hover:text-[#9a7339] transition-colors"
                >
                  Read More
                  <ArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="/case-studies"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#b78c4e] text-white rounded-md hover:bg-[#9a7339] transition-colors duration-300 font-medium"
          >
            View All Case Studies
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudies;
