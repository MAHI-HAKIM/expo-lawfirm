"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: 1,
    question: "How we can help you?",
    answer:
      "There are many variations of passages available but the majority have suffered alteration in some form, by injected humour or words which don't look even slightly believable. It is a long established fact.",
  },
  {
    id: 2,
    question: "Attorney with experience",
    answer:
      "Our attorneys have decades of combined experience in various legal fields. We handle cases ranging from simple legal consultations to complex litigation matters with the same level of dedication and expertise.",
  },
  {
    id: 3,
    question: "We care about the rest",
    answer:
      "We take a holistic approach to legal representation, considering not just the immediate legal issues but also the long-term implications for our clients. Our goal is to provide solutions that address your current needs while protecting your future interests.",
  },
  {
    id: 4,
    question: "Unique client experience division",
    answer:
      "Our firm features a dedicated client experience team that ensures every interaction with our firm exceeds expectations. From your initial consultation to the resolution of your case, we prioritize clear communication, responsiveness, and personalized service.",
  },
];

const Faq: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const toggleAccordion = (index: number): void => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden" id="faq" ref={ref}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#b78c4e] font-medium tracking-wider mb-3">/ FREQUENTLY ASKED QUESTIONS</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif">
            Things you need to know
            <br />
            and <span className="text-[#b78c4e]">we have answers</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Find answers to common questions about our legal services and processes. 
            If you don&apos;t find what you&apos;re looking for, feel free to contact us directly.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              className={`bg-[#212121] rounded-lg border border-[#333333] hover:border-[#b78c4e] transition-all duration-300 ${
                activeIndex === index ? "border-[#b78c4e]" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
            >
              <motion.button
                className="w-full px-6 py-4 text-left font-medium flex justify-between items-center"
                onClick={() => toggleAccordion(index)}
                whileHover={{ x: 5 }}
              >
                <span className="text-white font-medium">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#b78c4e]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#b78c4e]" />
                )}
              </motion.button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 text-gray-400">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
