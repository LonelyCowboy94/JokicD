"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  Computer 
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Portfolio", href: "/admin/portfolio", icon: Computer },
  { name: "Posts", href: "/admin/posts", icon: FileText },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, status } = useSession();

  const closeSidebar = () => setIsOpen(false);
  const userInitial = session?.user?.name?.[0]?.toUpperCase() || "J";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const isLoading = status === "loading";

  return (
    <>
      {/* OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-[1px] z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR ASIDE */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 select-none z-50 w-64 bg-slate-900 text-white p-4 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* MOBILE TRIGGER */}
        <div className="lg:hidden absolute top-3 left-63 z-60">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-slate-900 text-white rounded-tr-xl rounded-br-xl shadow-lg active:scale-90 transition-transform flex items-center justify-center border-y border-r border-slate-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex items-center gap-3 px-2 mb-10 mt-2 lg:mt-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">
            {userInitial}
          </div>
          <div className="text-xl font-bold tracking-tight uppercase">
            Admin<span className="text-blue-500">Panel</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            if (item.name === "Users") {
              if (isLoading || session?.user?.role !== "ADMIN") return null;
            }

            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar} 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="pt-4 mt-auto border-t border-slate-800">
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium"
          >
            <LogOut size={20} /> 
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}