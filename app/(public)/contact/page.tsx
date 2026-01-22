"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  CheckCircle2,
  Building2,
  User,
} from "lucide-react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  company: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  projectType: z
    .enum(["new", "existing"])
    .refine((val) => val !== undefined, {
      message: "Please select a project type",
    }),
  message: z.string().min(10, "Your message is too short"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { projectType: "new" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setIsSuccess(true);
        reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {" "}
      <Header />
      <div className="min-h-screen bg-[#020617] text-slate-300 px-6">
        <div className="flex py-40 items-center">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* LEFT SIDE: INFO */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12 my-auto"
            >
              <div>
                <h1 className="text-5xl font-black text-white mb-6 select-none">
                  Let&apos;s Build <br /> Something{" "}
                  <span className="text-indigo-500 font-mono tracking-tighter">
                    Great.
                  </span>
                </h1>
                <p className="text-lg text-slate-400 max-w-md leading-relaxed select-none">
                  Available for freelance projects and full-time opportunities.
                  Let&apos;s turn your vision into a high-performance reality.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
  {/* GitHub */}
  <motion.a
    href="https://github.com/LonelyCowboy94"
    target="_blank"
    whileHover={{ rotateY: 360 }}
    transition={{ duration: 0.6 }}
    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-indigo-500/50 transition-colors"
  >
    <Github className="text-indigo-500" size={24} />
  </motion.a>

  {/* LinkedIn */}
  <motion.a
    href="#"
    whileHover={{ rotateY: 360 }}
    transition={{ duration: 0.6 }}
    className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-indigo-500/50 transition-colors"
  >
    <Linkedin className="text-indigo-500" size={24} />
  </motion.a>

  {/* Email*/}
  <a
    href="mailto:nikola.jokic994@yahoo.co.uk"
    className="flex items-center gap-4 group text-slate-400 hover:text-white transition-colors"
  >
    <motion.div
      whileHover={{ rotateY: 360 }}
      transition={{ duration: 0.6 }}
      className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl group-hover:border-indigo-500/50 transition-all"
    >
      <Mail className="text-indigo-500" size={24} />
    </motion.div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</p>
      <p className="text-sm font-medium">nikola.jokic994@yahoo.co.uk</p>
    </div>
  </a>
</div>
                <div className="flex gap-4"></div>
              </div>
            </motion.div>

            {/* RIGHT SIDE: FORM */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden select-none"
            >
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
                  <div className="p-4 bg-emerald-500/10 rounded-full">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Message Sent!
                  </h2>
                  <p className="text-slate-400">
                    I&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-bold"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <User size={12} /> Full Name *
                      </label>
                      <input
                        {...register("name")}
                        className={`w-full bg-zinc-900 border ${errors.name ? "border-red-500" : "border-zinc-800"} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter italic">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                        <Building2 size={12} /> Company
                      </label>
                      <input
                        {...register("company")}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Email Address *
                    </label>
                    <input
                      {...register("email")}
                      className={`w-full bg-zinc-900 border ${errors.email ? "border-red-500" : "border-zinc-800"} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter italic">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Project Type */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Project Nature
                    </label>
                    <div className="flex gap-4">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="radio"
                          {...register("projectType")}
                          value="new"
                          className="hidden peer"
                        />
                        <div className="text-center p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-xs font-bold peer-checked:bg-indigo-600 peer-checked:text-white transition-all">
                          New Project
                        </div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="radio"
                          {...register("projectType")}
                          value="existing"
                          className="hidden peer"
                        />
                        <div className="text-center p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-xs font-bold peer-checked:bg-indigo-600 peer-checked:text-white transition-all">
                          Modification
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      How can I help? *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      className={`w-full bg-zinc-900 border ${errors.message ? "border-red-500" : "border-zinc-800"} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none`}
                      placeholder="Tell me about your project..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter italic">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Deploy Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

