"use client"

import Link from "next/link"
import { useState, useEffect } from "react";

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    
      useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
  return (
      <nav
        className={`fixed top-0 w-full z-50 transition-[background-color,padding,border-color] duration-300 border-b ${
          scrolled
            ? "bg-[#020617]/80 backdrop-blur-md border-white/10 py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              J
            </div>
            <span className="text-xl font-bold text-white tracking-tighter uppercase">
              Jokic <span className="text-blue-500">Dev</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link
              href="#services"
              className="hover:text-white transition-colors"
            >
              Services
            </Link>
            
            <Link href="#about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link
              href="/#"
              className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
  )
}

export default Header