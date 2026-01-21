"use client";

import { useState, useTransition } from "react";
import { createFileSystemItem } from "@/lib/actions";

type ItemType = "file" | "folder";

type Props = {
  parentId: string | null;
};

export default function CreateFileSystemItemForm({ parentId }: Props) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState<ItemType>("folder");
  const [href, setHref] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await createFileSystemItem({
        name,
        text,
        type,
        href: type === "file" ? href : undefined,
        parentId,
      });

      if ("error" in res) {
        setError(res.error ?? null);
      } else {
        setName("");
        setHref("");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl bg-zinc-900 p-6 shadow-lg"
    >
      <h2 className="text-xl font-semibold text-white">
        Add file / folder
      </h2>

      {/* NAME */}
      <div>
        <label className="mb-1 block text-sm text-zinc-400">
          Name
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* TEXT */}
      <div>
        <label className="mb-1 block text-sm text-zinc-400">
          Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* TYPE */}
      <div>
        <label className="mb-1 block text-sm text-zinc-400">
          Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ItemType)}
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="folder">Folder</option>
          <option value="file">File</option>
        </select>
      </div>

      {/* HREF */}
      {type === "file" && (
        <div>
          <label className="mb-1 block text-sm text-zinc-400">
            Href
          </label>
          <input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="/portfolio/project-1"
          />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-indigo-600 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
