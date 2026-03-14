'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">School SaaS</h2>
          <p className="text-xs text-blue-600 mt-1 font-medium">{user.role}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {user.role === 'SUPER_ADMIN' && (
            <Link href="/super-admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Schools Management
            </Link>
          )}
          {user.role === 'SCHOOL_ADMIN' && (
            <Link href="/school-admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Dashboard
            </Link>
          )}
          {user.role === 'SCHOOL_ADMIN' && (
            <Link href="/school-admin/users" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
              Users Management
            </Link>
          )}
          <div className="mt-8 pt-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
            >
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h1 className="text-lg font-medium text-gray-800">Dashboard</h1>
          <div className="text-sm text-gray-600">{user.email}</div>
        </header>
        <div className="flex-1 p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
