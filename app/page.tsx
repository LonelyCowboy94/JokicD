"use client";


import { motion } from "framer-motion";
import {
  Code2,
  Zap,
  Globe
} from "lucide-react";
import Hero from "@/components/public/Hero";
import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";

export default function HomePage() {
 
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      {/* --- HEADER --- */}
      <Header />
      {/* --- HERO SECTION --- */}
      <Hero />

      {/* --- FEATURES / STATS --- */}
      <section className="py-20 px-6 border-t border-white/5 bg-slate-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code2 className="text-blue-500" />}
              title="Clean Code"
              desc="Optimized, scalable and maintainable TypeScript architecture."
            />
            <FeatureCard
              icon={<Zap className="text-indigo-500" />}
              title="Fast Loading"
              desc="Server-side rendering and edge caching for instant performance."
            />
            <FeatureCard
              icon={<Globe className="text-blue-400" />}
              title="Modern UX"
              desc="User-centric interfaces designed for the web of tomorrow."
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
