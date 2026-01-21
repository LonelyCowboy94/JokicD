import { Breadcrumbs } from "@/components/admin/AdminBreadcrumb";
import { AuthProvider } from "@/components/admin/Providers";
import { Sidebar } from "@/components/admin/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
const session = await getServerSession(authOptions);
const sessionUser = session?.user.name;
  return (
    <AuthProvider session={session}>
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100">
      
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="h-16 select-none bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm">
          <h1 className="text-sm pl-6 lg:pl-0 font-medium text-slate-500">Admin Panel / <Breadcrumbs /></h1>
          <h2>{sessionUser}</h2>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
    </AuthProvider>
  );
}