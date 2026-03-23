'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building, 
  CreditCard, 
  CalendarCheck, 
  Bell, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { appUser, firebaseUser, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!firebaseUser) {
    router.replace('/login');
    return null;
  }
  if (!appUser) {
    router.replace('/onboarding');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">School SaaS</h2>
          <p className="text-xs text-blue-600 mt-1 font-medium">{appUser.role}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {appUser.role === 'SUPER_ADMIN' && (
            <Link href="/super-admin" className={`flex items-center px-4 py-2 text-sm rounded-md ${pathname === '/super-admin' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
              <Building className="w-5 h-5 mr-3" /> Schools Management
            </Link>
          )}
          
          {appUser.role === 'ADMIN' && (
            <>
              <Link href="/school-admin" className={`flex items-center px-4 py-2 text-sm rounded-md ${pathname === '/school-admin' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
              </Link>
              <Link href="/school-admin/students" className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${pathname === '/school-admin/students' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Users className="w-5 h-5 mr-3" /> Students
              </Link>
              <Link href="/school-admin/teachers" className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${pathname === '/school-admin/teachers' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <UserCheck className="w-5 h-5 mr-3" /> Teachers
              </Link>
              <Link href="/school-admin/classes" className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${pathname === '/school-admin/classes' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Building className="w-5 h-5 mr-3" /> Classes & Sections
              </Link>
              <Link href="/school-admin/fees" className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${pathname === '/school-admin/fees' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <CreditCard className="w-5 h-5 mr-3" /> Fees
              </Link>
              <Link href="/school-admin/attendance" className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${pathname === '/school-admin/attendance' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <CalendarCheck className="w-5 h-5 mr-3" /> Attendance
              </Link>
              <Link href="/school-admin/notices" className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${pathname === '/school-admin/notices' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <Bell className="w-5 h-5 mr-3" /> Notices
              </Link>
            </>
          )}

          {appUser.role === 'TEACHER' && (
            <>
              <Link href="/teacher" className={`flex items-center px-4 py-2 text-sm rounded-md ${pathname === '/teacher' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
              </Link>
              <Link href="/teacher/attendance" className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${pathname === '/teacher/attendance' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <CalendarCheck className="w-5 h-5 mr-3" /> Mark Attendance
              </Link>
            </>
          )}

          {appUser.role === 'PARENT' && (
            <>
               <Link href="/parent/fees" className={`flex items-center px-4 py-2 mt-1 text-sm rounded-md ${pathname === '/parent/fees' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}>
                <CreditCard className="w-5 h-5 mr-3" /> Pay Fees
              </Link>
            </>
          )}

          <div className="mt-8 pt-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOut className="w-5 h-5 mr-3" /> Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h1 className="text-lg font-medium text-gray-800">Dashboard</h1>
          <div className="text-sm text-gray-600">{appUser.email}</div>
        </header>
        <div className="flex-1 p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
