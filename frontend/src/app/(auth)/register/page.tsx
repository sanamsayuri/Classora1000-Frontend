'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-sm text-gray-500">Redirecting…</div>
    </div>
  );
}
