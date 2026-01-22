"use client";

import { useState, useCallback, useEffect } from "react"; 
import { getFileSystemTree } from "@/lib/actions";
import CreateFileSystemItemForm from "@/components/admin/CreateFileSystemItemForm";
import FileTree from "@/components/admin/FileTree";
import { FileItem } from "@/db/schema";
import { PlusCircle, Computer } from "lucide-react";

export default function PortfolioAdminPage() {
  const [tree, setTree] = useState<FileItem[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<FileItem | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const loadTree = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFileSystemTree();
      if ("success" in res) {
        setTree(res.success ?? []);
      }
    } catch (error) {
      console.error("Failed to load tree:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTree();
  }, [loadTree]);

  const handleSuccess = () => {
    loadTree();
    setEditingItem(undefined); 
  };

  return (
    <div className="min-h-screen text-white">
      <div className="grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
        
        {/* LEFT: TREE NAV */}
        <aside className="custom-scrollbar rounded-2xl border border-zinc-800 bg-zinc-900/85 p-6 backdrop-blur-sm h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-tight">Explorer</h2>
            <button 
              onClick={() => {
                setEditingItem(undefined);
                setParentId(null);
              }}
              className="p-1 hover:bg-white/10 rounded-md text-zinc-400"
              title="Add to Root"
            >
              <PlusCircle size={20} />
            </button>
          </div>

          <button
            onClick={() => {
              setParentId(null);
              setEditingItem(undefined);
            }}
            className={`mb-4 w-full rounded-xl flex gap-2 px-4 py-2 text-left text-sm font-medium transition-all ${
              parentId === null && !editingItem
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            <Computer size={16} /> Root Directory
          </button>

          <div className="overflow-y-auto max-h-[60vh] custom-scrollbar">
            {loading ? (
              <div className="space-y-2 animate-pulse">
                {[1,2,3,4,5].map(i => <div key={i} className="h-8 bg-zinc-800 rounded-lg w-full" />)}
              </div>
            ) : (
              <FileTree
                items={tree}
                selectedId={parentId}
                editingId={editingItem?.id}
                onSelect={setParentId}
                onEdit={(item) => {
                    setEditingItem(item);
                    setParentId(item.parentId || null); 
                }}
              />
            )}
          </div>
        </aside>

        {/* RIGHT: FORM */}
        <main className="md:col-span-2 flex">
          <div className="w-full max-w-xl">
            <CreateFileSystemItemForm 
              key={editingItem?.id || "new-item"} 
              parentId={parentId} 
              editItem={editingItem} 
              onSuccess={handleSuccess}
            />
          </div>
        </main>
      </div>
    </div>
  );
}