"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Calendar, MessageSquare, User } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Courtroom Moment",
    excerpt: "What legal drama was writer Aaron Sorkin’s first screenplay?",
    image: "/blog-1.png",
    date: "26 NOV",
    author: "Admin",
    comments: 2,
    link: "https://abovethelaw.com/2025/03/the-ultimate-courtroom-moment/",
  },
  {
    id: 2,
    title: "Understanding the Supreme Court's Decision on USAID Funding",
    excerpt:
      "The U.S. Supreme Court has limited the scope of President Donald Trump’s authority to temporarily halt federal funding for foreign assistance",
    image: "/blog-2.png",
    date: "26 NOV",
    author: "Admin",
    comments: 2,
    link: "https://www.findlaw.com/legalblogs/federal-courts/understanding-the-supreme-courts-decision-on-usaid-funding/",
  },
  {
    id: 3,
    title: "Will Columbia University's Mahmoud Khalil Be Deported?",
    excerpt:
      "The post featured a photo of Mahmoud Khalil, a pro-Palestinian activist and leader of protests at Columbia University who was recently arrested",
    image: "/blog-3.png",
    date: "26 NOV",
    author: "Admin",
    comments: 2,
    link: "https://www.findlaw.com/legalblogs/courtside/will-columbia-universitys-mahmood-khalil-be-deported-for-his-political-activism/",
  },
];

export default function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      className="py-24 bg-[#1a1a1a] text-white overflow-hidden"
      id="blog"
      ref={ref}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#b78c4e] font-medium tracking-wider mb-3">
            / RECENT NEWS FEED
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-serif">
            Latest News & Articles
            <br />
            From <span className="text-[#b78c4e]">Our Blog</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Stay informed with our latest insights, legal updates, and success
            stories. Our blog provides valuable information to help you navigate
            the complex legal landscape.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-[#212121] rounded-lg overflow-hidden border border-[#333333] hover:border-[#b78c4e] transition-all duration-300 shadow-lg"
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="relative overflow-hidden h-60">
                <Image
                  src={post.image || `/placeholder.svg?height=300&width=400`}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <motion.div
                  className="absolute top-4 left-4 bg-[#b78c4e] text-white text-sm py-1 px-3 rounded-md flex items-center z-10"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  {post.date}
                </motion.div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-400 mb-3">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" /> {post.author}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" /> {post.comments}{" "}
                    Comments
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  <Link
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#b78c4e] transition-colors duration-300"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={post.link}
                  target="_blank"
                  className="text-[#b78c4e] font-medium inline-flex items-center group"
                >
                  <span className="relative">
                    Read More
                    <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#b78c4e] group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <motion.span
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="/blog"
              className="inline-flex h-14 bg-[#b78c4e] text-white px-8 rounded-md hover:bg-[#9a7339] transition-all duration-300 items-center justify-center font-medium"
            >
              View All Articles
              <motion.span
                className="inline-block ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
