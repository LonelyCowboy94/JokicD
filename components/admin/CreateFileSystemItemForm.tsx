"use client";

import { useState, useTransition } from "react";
import { createFileSystemItem, updateFileSystemItem } from "@/lib/actions";

type ItemType = "file" | "folder";

type Props = {
  parentId: string | null;
  editItem?: {
    id: string;
    name: string;
    text: string | null;
    type: ItemType;
    href?: string | null;
  };
  onSuccess?: () => void;
};

export default function CreateFileSystemItemForm({ parentId, editItem, onSuccess }: Props) {
 const [name, setName] = useState(editItem?.name ?? "");
  const [text, setText] = useState(editItem?.text ?? "");
  const [type, setType] = useState<ItemType>(editItem?.type ?? "folder");
  const [href, setHref] = useState(editItem?.href ?? "");
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        let res;
        
         const payload = {
          name,
          type,
          text: type === "file" ? text : "",
          href: (type === "file" && href) ? href : undefined, 
        };

        if (editItem) {
          res = await updateFileSystemItem({
            id: editItem.id,
            ...payload,
            parentId: parentId ?? undefined,
          });
        } else {
          res = await createFileSystemItem({
            ...payload,
            parentId,
          });
        }

        if (res && "error" in res) {
          setError(res.error as string);
        } else {
          onSuccess?.();
        }
      } catch (err) {
        console.log(err);
        setError("An unexpected error occurred");
      }
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl bg-zinc-900/85 border border-zinc-800 p-6 shadow-2xl backdrop-blur-md"
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-2">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {editItem ? "Edit Item" : "New Item"}
        </h2>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded uppercase font-bold tracking-widest border border-indigo-500/20">
          {type}
        </span>
      </div>

      <div className="space-y-4">
        {/* TYPE SELECTOR */}
        <div className="flex gap-2 p-1 bg-zinc-800/50 rounded-xl border border-zinc-700">
          {(["folder", "file"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                type === t 
                  ? "bg-indigo-600 text-white shadow-lg" 
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* NAME */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Name {type === 'file' && <span className="text-[10px] text-zinc-600">(e.g. bio.txt)</span>}
          </label>
          <input
            required
            placeholder={type === "folder" ? "New Folder" : "document.txt"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-zinc-800/50 border border-zinc-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* FILE SPECIFIC FIELDS */}
        {type === "file" && (
          <>
            {/* HREF (Za web stranice) */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                External Redirect URL <span className="text-[10px] text-zinc-600">(Optional)</span>
              </label>
              <input
                placeholder="https://github.com/..."
                value={href}
                onChange={(e) => setHref(e.target.value)}
                className="w-full rounded-xl bg-zinc-800/50 border border-zinc-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
              />
            </div>

            {/* TEXT (Sadržaj za Notepad) */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                File Content <span className="text-[10px] text-zinc-600">(For Notepad)</span>
              </label>
              <textarea
                rows={4}
                placeholder="Type the content of your .txt file here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-xl bg-zinc-800/50 border border-zinc-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm resize-none"
              />
            </div>
          </>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-1">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          editItem ? "Update Item" : "Create Item"
        )}
      </button>
    </form>
  );
}

// Pomoćna funkcija za klase (ako je nemaš u lib/utils)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}