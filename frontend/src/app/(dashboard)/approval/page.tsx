'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';

function ApprovalAction() {
  const { supabaseUser, appUser, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const action = searchParams.get('action'); // 'approve' or 'reject'
  const targetUid = searchParams.get('uid');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const performAction = async () => {
      // Don't run if auth is loading or if we already have a result
      if (authLoading || result || loading) return;

      if (!supabaseUser) {
        setResult({ success: false, message: 'You must be logged in to perform this action. Please log in and click the link again.' });
        return;
      }

      if (!action || !targetUid) {
        setResult({ success: false, message: 'Invalid link. Missing action or user ID.' });
        return;
      }

      if (action !== 'approve' && action !== 'reject') {
        setResult({ success: false, message: 'Invalid action.' });
        return;
      }

      setLoading(true);
      try {
        const { createClient } = require('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const endpoint = action === 'approve' ? '/approval/approve-user' : '/approval/reject-user';

        const response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ targetUid })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to perform action');
        }

        setResult({ success: true, message: `Successfully ${action}d the user.` });
      } catch (err: any) {
        setResult({ success: false, message: err.message || 'An error occurred.' });
      } finally {
        setLoading(false);
      }
    };

    performAction();
  }, [supabaseUser, authLoading, action, targetUid, result, loading]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Processing your request...</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      {result?.success ? (
        <>
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Success</h2>
          <p className="text-gray-600">{result.message}</p>
        </>
      ) : (
        <>
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Action Failed</h2>
          <p className="text-gray-600">{result?.message || 'An unknown error occurred.'}</p>
        </>
      )}
      <div className="pt-6">
         <a href="/" className="text-blue-600 hover:text-blue-500 font-medium text-sm">Return to Dashboard</a>
      </div>
    </div>
  );
}

export default function ApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        }>
          <ApprovalAction />
        </Suspense>
      </div>
    </div>
  );
}
