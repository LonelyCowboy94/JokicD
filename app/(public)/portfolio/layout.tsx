import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import { FileSidebar } from "@/components/public/Sidebar";
import { getFileSystemTree } from "@/lib/actions";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { success: tree } = await getFileSystemTree();

  return (
    <div className="flex min-h-screen bg-[#020617]">
      <FileSidebar tree={tree || []} />
      <main className="flex-1 relative bg-[#03081c] overflow-y-auto">
        {/* Glow efekat */}
        <div className="fixed top-0 right-0 w-125 h-125 bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="relative z-10">
            <Header />
            {children}</div>
            <Footer />
      </main>
    </div>
  );
}