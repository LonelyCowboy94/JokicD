import { getAllUsers } from "@/lib/actions";
import { UserTable } from "@/components/admin/UserTable";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function UsersPage() {
  const users = await getAllUsers();
  const session = await getServerSession(authOptions);
if (session?.user?.role !== "ADMIN") {
    redirect("/admin"); 
  }
  return (
    <div className="max-w-6xl space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
        <p className="text-slate-500">Manage team members, roles, and access credentials.</p>
      </div>
      
      <section className="space-y-4 pb-20">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Registered Users ({users.length})</h2>
        <UserTable users={users} />
      </section>
    </div>
  );
}