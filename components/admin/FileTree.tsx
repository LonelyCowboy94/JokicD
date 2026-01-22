"use client";

import { FileItem } from "@/db/schema";
import { Edit2, Folder, FileText, HardDriveIcon, Computer, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  items: FileItem[];
  selectedId: string | null;
  editingId?: string;
  onSelect: (id: string | null) => void;
  onEdit: (item: FileItem) => void;
};

export default function FileTree({ items, selectedId, editingId, onSelect, onEdit }: Props) {
  return (
    <ul className="space-y-1 border-l border-zinc-800 ml-2">
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        const isEditing = editingId === item.id;

        return (
          <li key={item.id} className="group pl-4">
            <div 
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-2 py-1.5 transition-all",
                isSelected ? "bg-indigo-600/10 text-indigo-400" : "text-zinc-400 hover:bg-zinc-800/50",
                isEditing && "ring-1 ring-indigo-500 bg-indigo-500/5"
              )}
            >
              <button
                onClick={() => item.type === "folder" && onSelect(item.id)}
                className="flex flex-1 items-center gap-2 text-left text-sm"
              >
                {item.name.includes("PC") ? (
          <Computer size={16} />
        ) : item.name.includes(":)") ? (
          <HardDriveIcon size={16} />
        ) : item.type === "folder" ? (
          <Folder size={16} />
        ) : item.name.toLowerCase().endsWith(".txt") ? (
          <FileText size={16} />
        ) : (
          <Globe size={16} className="text-blue-400" />
        )}
                <span className="truncate">{item.name}</span>
              </button>

              {/* Edit dugme koje se pojavljuje na hover */}
              <button
                onClick={() => onEdit(item)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-all"
              >
                <Edit2 size={12} />
              </button>
            </div>

            {item.children && item.children.length > 0 && (
              <FileTree
                items={item.children}
                selectedId={selectedId}
                editingId={editingId}
                onSelect={onSelect}
                onEdit={onEdit}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}