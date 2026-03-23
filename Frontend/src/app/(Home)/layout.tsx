import React from "react";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import BackToTop from "@/components/ui/BackToTop";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} `}>
      <Navbar />
      {children}
      <BackToTop />
      <Footer />
    </div>
  );
}
