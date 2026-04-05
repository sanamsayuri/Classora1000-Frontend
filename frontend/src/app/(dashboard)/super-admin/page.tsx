'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth, AppUserDoc } from '@/context/AuthContext';

export default function SuperAdminDashboard() {
  const { appUser } = useAuth();
  const supabase = createClient();
  const [users, setUsers] = useState<AppUserDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setUsers(data as AppUserDoc[]);
    }
    setLoading(false);
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('users')
      .update({ approved: !currentStatus })
      .eq('id', id);
      
    if (!error) {
      setUsers(users.map(u => u.id === id ? { ...u, approved: !currentStatus } : u));
    } else {
      alert('Error updating approval status');
    }
  };
  
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to completely remove this user?')) return;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setUsers(users.filter(u => u.id !== id));
    } else {
      alert('Error deleting user');
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Super Admin Dashboard</h1>
          <p className="mt-2 text-gray-500 font-medium">Manage platform users and access approvals.</p>
        </div>
        <div className="flex items-center space-x-3 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
           <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
           <span className="text-sm font-bold text-purple-700">SUPER ADMIN PRIVILEGES</span>
        </div>
      </div>

      <div className="bg-white shadow-xl shadow-gray-200/40 border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-700 text-lg uppercase shadow-sm border border-blue-200/50">
                        {user.full_name?.charAt(0) || user.email?.charAt(0)}
                      </div>
                      <div className="ml-5">
                        <div className="text-sm font-bold text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500 font-medium">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.organization_name || '-'}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 capitalize border border-indigo-100">
                      {user.role}
                    </span>
                    {user.is_super_admin && (
                      <span className="ml-2 px-3 py-1 inline-flex text-xs font-bold rounded-lg bg-purple-50 text-purple-700 border border-purple-100">
                        SUPER ADMIN
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {user.approved ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <svg className="mr-1.5 h-3.5 w-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                        <svg className="mr-1.5 h-3.5 w-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleToggleApproval(user.id, user.approved)}
                      disabled={user.is_super_admin}
                      className={`mr-4 px-4 py-2 rounded-lg text-xs font-bold transition-all ${user.is_super_admin ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : user.approved ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-transparent hover:border-amber-200' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-transparent hover:border-emerald-200 shadow-sm shadow-emerald-500/20'}`}
                    >
                      {user.approved ? 'Revoke Access' : 'Approve Access'}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.is_super_admin}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${user.is_super_admin ? 'text-gray-400 cursor-not-allowed hidden' : 'text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 opacity-0 group-hover:opacity-100'}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">No users found in the system yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
