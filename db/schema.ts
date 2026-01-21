import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export const fileTypeEnum = pgEnum("file_type", ["file", "folder"]);

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"), 
  role: roleEnum("role").default("USER"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fileSystem = pgTable("file_system", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  href: text("href"), 
  text: text("text"),
  type: fileTypeEnum("type").default("file").notNull(),
  parentId: uuid("parent_id"),
});


export type FileItem = {
  id: string;
  name: string;
  text: string;
  href?: string | null;
  type: "file" | "folder";
  parentId?: string | null;
  children?: FileItem[]; 
};