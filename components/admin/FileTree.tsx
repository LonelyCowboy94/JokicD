"use client";

import { FileItem } from "@/db/schema";

type Props = {
  items: FileItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export default function FileTree({ items, selectedId, onSelect }: Props) {
  return (
    <ul className="space-y-1 pl-2">
      {items.map((item) => (
        <li key={item.id}>
          <button
            onClick={() =>
              item.type === "folder" ? onSelect(item.id) : null
            }
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left
              ${
                selectedId === item.id
                  ? "bg-indigo-600/20 text-indigo-400"
                  : "hover:bg-zinc-800"
              }
            `}
          >
            <span>
              {item.type === "folder" ? "📁" : "📄"}
            </span>
            <span className="truncate">{item.name}</span>
          </button>

          {item.children && item.children.length > 0 && (
            <FileTree
              items={item.children}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
