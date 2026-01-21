"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FileText, 
  X, 
  ArrowLeft, 
  ArrowRight,
  Globe,
  HardDrive
} from "lucide-react";
import { FileItem } from "@/db/schema";
import { cn } from "@/lib/utils";

interface TreeItemProps {
  item: FileItem;
  level: number;
  activeFolderId: string | null;
  onItemClick: (item: FileItem) => void;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
}

// --- Notepad File ---
function Notepad({ file, onClose }: { file: FileItem, onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 bg-[#020617] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between bg-white/10 px-4 py-1.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-blue-400" />
          <span className="text-xs font-medium text-slate-300">{file.name} - Notepad</span>
        </div>
        <div onClick={onClose} className="hover:bg-red-500/80 p-1 rounded cursor-pointer transition-colors group">
          <X size={14} className="text-slate-400 group-hover:text-white" />
        </div>
      </div>
      <textarea 
        autoFocus
        className="flex-1 bg-transparent p-4 text-sm text-slate-300 outline-none resize-none font-mono"
        defaultValue={`${file.text}`}
      />
    </div>
  );
}

// --- Tree Item ---
function TreeItem({ item, level, activeFolderId, onItemClick, expandedIds, toggleExpand }: TreeItemProps) {
  const isExpanded = expandedIds.has(item.id);
  const isActive = activeFolderId === item.id;

  return (
    <div className="select-none">
      <div 
        onClick={() => {
          onItemClick(item);
          if (item.type === 'folder') toggleExpand(item.id);
        }}
        className={cn(
          "flex items-center gap-2 py-1 px-2 cursor-pointer rounded-md transition-colors",
          isActive ? "bg-blue-600/30 text-blue-200" : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
        )}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
      >
        <span className="w-4">
          {item.children && item.children.length > 0 && (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />)}
        </span>
        {item.type === 'folder' ? (
          <Folder size={16} />
        ) : item.name.toLowerCase().endsWith('.txt') ? (
          <FileText size={16} />
        ) : (
          <Globe size={16} className="text-blue-400" />
        )}
        <span className="text-sm truncate">{item.name}</span>
      </div>
      {isExpanded && item.children?.map((child) => (
        <TreeItem 
          key={child.id} 
          item={child} 
          level={level + 1} 
          activeFolderId={activeFolderId} 
          onItemClick={onItemClick} 
          expandedIds={expandedIds} 
          toggleExpand={toggleExpand} 
        />
      ))}
    </div>
  );
}

// --- Sidebar ---
export function FileSidebar({ tree }: { tree: FileItem[] }) {
  const router = useRouter(); 
  const [history, setHistory] = useState<FileItem[]>([tree[0]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([tree[0].id]));
  const [openedFile, setOpenedFile] = useState<FileItem | null>(null);

  const currentFolder = history[historyIndex];

  const handleItemAction = (item: FileItem) => {
    if (item.type === "folder") {
      if (item.id === currentFolder.id) return;
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, item]);
      setHistoryIndex(newHistory.length);
      setExpandedIds(prev => new Set(prev).add(item.id));
      return;
    }

    if (item.name.toLowerCase().endsWith('.txt')) {
      setOpenedFile(item);
      return;
    }

    if (item.href) {
      if (item.href.startsWith('http')) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(item.href);
      }
    }
  };

  const goBack = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex w-full h-[90%] p-[2%] overflow-hidden absolute items-center justify-center">
      <div className="flex flex-col w-full h-full max-w-6xl z-20 bg-[#020617] border border-white/10 rounded-xl shadow-2xl overflow-hidden shadow-black/50 relative">
        
        {openedFile && <Notepad file={openedFile} onClose={() => setOpenedFile(null)} />}

        {/* Title Bar */}
        <div className="flex items-center justify-between bg-white/5 px-4 py-2 border-b border-white/5 select-none">
          <div className="flex items-center gap-2">
            <Folder size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-300">File Explorer</span>
          </div>
          <Link href="/" className="hover:bg-red-500/20 p-1 rounded-md group">
            <X size={16} className="text-slate-500 group-hover:text-red-500" />
          </Link>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center gap-4 bg-white/5 p-2 border-b border-white/5">
          <div className="flex items-center gap-1">
            <button onClick={goBack} disabled={historyIndex === 0} className="p-1.5 hover:bg-white/10 rounded disabled:opacity-20">
              <ArrowLeft size={16} className="text-slate-300" />
            </button>
            <button onClick={goForward} disabled={historyIndex === history.length - 1} className="p-1.5 hover:bg-white/10 rounded disabled:opacity-20">
              <ArrowRight size={16} className="text-slate-300" />
            </button>
          </div>
          <div className="flex-1 flex items-center bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-slate-400 font-mono">
             C:\{history.map(h => h.name).join(' > ')}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tree */}
          <aside className="w-64 border-r border-white/5 overflow-y-auto p-4 bg-black/20 custom-scrollbar">
            {tree.map(item => (
              <TreeItem 
                key={item.id} 
                item={item} 
                level={0} 
                activeFolderId={currentFolder.id}
                onItemClick={handleItemAction}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
              />
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-transparent p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentFolder.children?.map((child) => (
                <div
                  key={child.id}
                  onClick={() => handleItemAction(child)}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-white/5 cursor-pointer transition-all group"
                >
                  <div className="mb-2">
                    {child.name.includes("(C:)") || child.name.includes("(D:)") ? (
                      <HardDrive size={48} className="text-slate-500" />
                    ) : child.type === "folder" ? (
                      <Folder size={48} className="text-slate-400" />
                    ) : child.name.includes(".txt") ? (<FileText size={48} className="text-slate-500" />) : (
                      <Globe size={48} className="text-blue-400" />
                    )}
                  </div>
                  <span className="text-xs text-slate-300 text-center line-clamp-2">{child.name}</span>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
