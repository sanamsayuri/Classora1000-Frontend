'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PendingApprovalPage() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100">
        <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-100">
          <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Account Pending Approval
          </h2>
          <p className="mt-4 text-base text-gray-500 leading-relaxed">
            Your account has been successfully created and is currently awaiting Super Admin approval. Once approved, you will automatically be granted access.
          </p>
        </div>

        <div className="pt-6 space-y-4">
          <button
            onClick={() => router.refresh()}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98]"
          >
            Refresh Status
          </button>

          <button
            onClick={logout}
            className="w-full flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all active:scale-[0.98]"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
