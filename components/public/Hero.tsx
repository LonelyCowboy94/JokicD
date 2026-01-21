"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  ChevronRight, 
  Computer, 
  Recycle, 
  FileText, 
  Folder, 
  X, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";

// 1. Bin content
const RECYCLE_BIN_DATA = [
  { id: 'rb-1', name: 'old-index.php', type: 'file', isPhp: true },
  { id: 'rb-2', name: 'wp-config-backup.php', type: 'file', isPhp: true },
  { id: 'rb-3', name: 'legacy-wordpress-site', type: 'folder' },
  { id: 'rb-4', name: 'deprecated-plugin.php', type: 'file', isPhp: true },
];

// BlueScreen 
function BlueScreen() {
  return (
    <div className="fixed inset-0 z-999 bg-[#0078d7] text-white p-10 md:p-20 flex flex-col font-sans select-none overflow-hidden">
      <div className="text-[120px] mb-10">:(</div>
      <h1 className="text-2xl md:text-4xl mb-8 leading-tight max-w-3xl">
        Your PC ran into a problem and needs to restart. We&apos;re just collecting some error info, and then we&apos;ll restart for you.
      </h1>
      <div className="text-xl mb-10">
        100% complete
      </div>
      <div className="flex gap-6 items-start mt-auto">
        <div className="bg-white p-2">
          <div className="w-24 h-24 bg-black"></div>
        </div>
        <div className="text-sm space-y-1">
          <p>For more information about this issue and possible fixes, visit https://windows.com/stopcode</p>
          <p>If you call a support person, give them this info:</p>
          <p className="font-bold">Stop code: CRITICAL_PROCESS_DIED</p>
        </div>
      </div>
      <div 
        onClick={() => window.location.reload()} 
        className="absolute inset-0 opacity-0 cursor-pointer" 
        title="Click to restart"
      />
    </div>
  );
}

const Hero = () => {
  // 3. States moraju biti na vrhu komponente
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [recycleFiles, setRecycleFiles] = useState(RECYCLE_BIN_DATA); 
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);

  return (
    <section>
     
      {isCrashed && <BlueScreen />}

      <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        
        {/* --- DESKTOP ICONS --- */}
        <div className="max-w-7xl mx-auto relative">
           {/* Portfolio Icon */}
          <Link
            href="/portfolio"
            className="px-1 py-4 hidden md:flex absolute left-2 w-28 flex-col z-20 items-center hover:bg-white/10 text-white font-bold rounded-lg backdrop-blur-sm group"
          >
            <Computer size={48} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
            <span className="text-[11px] mt-1 drop-shadow-md">Portfolio</span>
          </Link>

          {/* Recycle bin Icon */}
          <div
            onClick={() => setIsRecycleBinOpen(true)}
            className="px-1 py-4 absolute right-2 top-100 w-28 flex flex-col z-20 items-center cursor-pointer hover:bg-white/10 text-white font-bold rounded-lg backdrop-blur-sm group"
          >
            <div className="relative hidden md:flex">
              <Recycle size={48} className="text-slate-400 group-hover:text-slate-300" />
              {recycleFiles.length > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-900" />
              )}
            </div>
            <span className="text-[11px] mt-1 drop-shadow-md">Recycle Bin</span>
          </div>
        </div>

        {/* --- RECYCLE BIN WINDOW --- */}
        {isRecycleBinOpen && !isCrashed && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col w-full max-w-2xl h-112.5 bg-[#020617] border border-white/10 rounded-xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
              
              {/* Title Bar */}
              <div className="flex items-center justify-between bg-white/5 px-4 py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Recycle size={14} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-300">Recycle Bin</span>
                </div>
                <button 
                  onClick={() => setIsRecycleBinOpen(false)} 
                  className="hover:bg-red-500/20 hover:cursor-pointer p-1 rounded-md transition-all group"
                >
                  <X size={16} className="text-slate-500 group-hover:text-red-500" />
                </button>
              </div>

              {/* Ribbon commands */}
              <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex gap-6 text-[11px] font-medium text-slate-400">
                <button 
                  onClick={() => setRecycleFiles([])} 
                  disabled={recycleFiles.length === 0}
                  className="hover:text-white hover:cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-20"
                >
                  <X size={12} className="text-red-500" /> Empty Recycle Bin
                </button>
                <button 
                  onClick={() => setShowRestorePrompt(true)} 
                  disabled={recycleFiles.length === 0}
                  className="hover:text-white hover:cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-20"
                >
                  <ArrowLeft size={12} className="text-blue-500" /> Restore all items
                </button>
              </div>

              {/* Folder Content */}
              <div className="flex-1 p-6 overflow-y-auto bg-black/20 custom-scrollbar">
                {recycleFiles.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
                    {recycleFiles.map((item) => (
                      <div key={item.id} className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                         {item.type === 'folder' ? (
                           <Folder size={42} className="text-slate-500 fill-slate-500/10" />
                         ) : (
                           <div className="relative">
                             <FileText size={42} className="text-slate-600" />
                             <span className="absolute bottom-0 right-0 bg-indigo-600 text-[8px] px-1 rounded text-white font-bold">PHP</span>
                           </div>
                         )}
                         <span className="text-[10px] text-slate-400 text-center truncate w-full">{item.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-sm">
                    Recycle Bin is empty
                  </div>
                )}
              </div>

              {/* footer status */}
              <div className="bg-white/5 px-4 py-1 text-[10px] text-slate-500 border-t border-white/5">
                {recycleFiles.length} items
              </div>

              {/* --- RESTORE PROMPT (Inside Modal) --- */}
              {showRestorePrompt && (
                <div className="absolute inset-0 z-70 bg-black/60 flex items-center justify-center p-6 animate-in fade-in">
                  <div className="bg-[#1e1e2e] border border-white/20 w-full max-w-sm rounded-lg shadow-2xl p-6">
                    <div className="flex items-center gap-3 mb-4 text-amber-500">
                      <div className="p-2 bg-amber-500/10 rounded-full text-xl font-bold italic">!</div>
                      <h3 className="text-sm font-bold text-slate-200 uppercase">System Warning</h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                      Are you sure you want to restore <span className="text-amber-400 font-bold">deprecated files</span>? 
                      This legacy configuration might cause a system crash.
                    </p>
                    <div className="flex gap-3 justify-end">
                      <button 
                        onClick={() => setShowRestorePrompt(false)}
                        className="px-4 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => setIsCrashed(true)}
                        className="px-6 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                      >
                        Yes, Restore
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- HERO CONTENT --- */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-[0%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Zap size={14} /> Available for new projects
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl text-white font-black tracking-tight mb-8 leading-[1.1]"
            >
              Jokic Web <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-indigo-400 to-blue-600">
                Development
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed"
            >
              Crafting high-performance digital experiences with Next.js and
              cutting-edge tech. We turn complex ideas into seamless, scalable
              web applications.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="px-8 py-4 hover:cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 group">
                Start a Project
                <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;