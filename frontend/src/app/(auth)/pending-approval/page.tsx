'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PendingApprovalPage() {
  const { appUser, logout } = useAuth();
  const router = useRouter();

  if (appUser && appUser.approvalStatus === 'approved') {
    const role = appUser.roleAssigned || appUser.role;
    const targetPath =
      role === 'SUPER_ADMIN' || role === 'admin' || role === 'ADMIN'
        ? '/super-admin'
        : role === 'TEACHER' || role === 'teacher'
          ? '/teacher'
          : '/school-admin';
    router.replace(targetPath);
    return null;
  }

  const isRejected = appUser?.approvalStatus === 'rejected';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
        {isRejected ? (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Request Rejected</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your registration request has been rejected by the administrator. Please contact support if you believe this is a mistake.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Pending Approval</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your account registration is currently being reviewed by an administrator.
              You will receive an email once your account is approved.
            </p>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => logout()}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Sign out and return to login
          </button>
        </div>
      </div>
    </div>
  );
}
