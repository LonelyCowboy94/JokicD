"use client";

import { useState } from "react";
import { 
  Mail, ShieldCheck, Shield, Edit, Trash2, 
  Loader2, X, Search, User, Lock, ChevronDown 
} from "lucide-react";
import { updateUser, deleteUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { CreateUserForm } from "./CreateUserForm";

interface UserType {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN" | null;
}

export function UserTable({ users }: { users: UserType[] }) {
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Client-side filtering logic
  const filteredUsers = users.filter((user) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchStr) || 
      user.email.toLowerCase().includes(searchStr)
    );
  });

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateUser(editingUser.id, formData);
    
    if (res.success) {
      setEditingUser(null);
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      const res = await deleteUser(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error);
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
      {/* SEARCH BAR */}
      <div className="relative max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CreateUserForm />
      </div>
      <div className="card overflow-hidden shadow-sm border border-slate-200 bg-white rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">User Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{user.name || "Anonymous User"}</div>
                      <div className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5">
                        <Mail size={13} className="text-slate-400" /> 
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                        user.role === 'ADMIN' 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                          : 'bg-white text-slate-600 border border-slate-200 shadow-sm'
                      }`}>
                        {user.role === 'ADMIN' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => setEditingUser(user)} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit user"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">
                    No users found matching your search...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-100 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
                <p className="text-sm text-slate-500 mt-1">Update account details and permissions</p>
              </div>
              <button 
                onClick={() => setEditingUser(null)} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                  <User size={16} className="text-slate-400" />
                  Full Name
                </label>
                <input 
                  name="name" 
                  defaultValue={editingUser.name || ""} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" 
                  placeholder="e.g. John Doe"
                  required 
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                  <Mail size={16} className="text-slate-400" />
                  Email Address
                </label>
                <input 
                  name="email" 
                  type="email"
                  defaultValue={editingUser.email} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" 
                  placeholder="john@example.com"
                  required 
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                  <Shield size={16} className="text-slate-400" />
                  Role & Permissions
                </label>
                <div className="relative">
                  <select 
                    name="role" 
                    defaultValue={editingUser.role || "USER"} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="USER">Standard User</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                </div>
              </div>

              {/* Security Divider */}
              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-white px-3 text-slate-400">Security</span>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 ml-1">
                  <Lock size={16} className="text-slate-400" />
                  New Password
                </label>
                <input 
                  name="password" 
                  type="password" 
                  className="w-full bg-slate-50 border border-slate-200 border-dashed rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" 
                  placeholder="Leave blank to keep current" 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)} 
                  className="flex-1 px-6 py-3.5 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}