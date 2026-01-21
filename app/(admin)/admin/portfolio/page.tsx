"use client";

import { useEffect, useState } from "react";
import { getFileSystemTree } from "@/lib/actions";
import CreateFileSystemItemForm from "@/components/admin/CreateFileSystemItemForm";
import FileTree from "@/components/admin/FileTree";
import { FileItem } from "@/db/schema";

export default function PortfolioAdminPage() {
  const [tree, setTree] = useState<FileItem[]>([]);
  const [parentId, setParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTree() {
      const res = await getFileSystemTree();
      if ("success" in res) {
        setTree(res.success ?? []);
      }
      setLoading(false);
    }

    loadTree();
  }, []);

  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
        
        {/* TREE */}
        <aside className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="mb-4 text-lg font-semibold">
            File system
          </h2>

          <button
            onClick={() => setParentId(null)}
            className={`mb-2 w-full rounded-md px-2 py-1 text-left ${
              parentId === null
                ? "bg-indigo-600/20 text-indigo-400"
                : "hover:bg-zinc-800"
            }`}
          >
            📂 Root
          </button>

          {loading ? (
            <p className="text-sm text-zinc-400">Loading...</p>
          ) : (
            <FileTree
              items={tree}
              selectedId={parentId}
              onSelect={setParentId}
            />
          )}
        </aside>

        {/* FORM */}
        <main className="md:col-span-2">
          <CreateFileSystemItemForm parentId={parentId} />
        </main>
      </div>
    </div>
  );
}
