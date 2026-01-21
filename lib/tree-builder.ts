import { FileItem } from "@/db/schema";

interface RawFileItem {
  id: string;
  parentId: string | null;
  name: string;
}

export function buildTree(items: RawFileItem[], parentId: string | null = null): FileItem[] {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(items, item.id), 
    })) as FileItem[]; 
}
