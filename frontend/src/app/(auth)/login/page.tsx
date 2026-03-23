'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Redirect is handled by AuthProvider based on Firestore user existence.
    } catch (e: any) {
      setError(e?.message || 'Google sign-in failed');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      {/* Left side: Premium Image/Branding pattern */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#09090b] overflow-hidden items-center justify-center">
        {/* Subtle animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl" />
        
        {/* Abstract pattern or illustration */}
        <div className="relative z-10 w-full max-w-lg p-12 space-y-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg shadow-blue-500/20" />
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              School<span className="text-blue-400">SaaS</span>
            </span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-medium tracking-tight text-white leading-tight">
              Manage your entire campus, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">effortlessly.</span>
            </h2>
            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-md">
              A comprehensive platform designed specifically for modern educational institutions to streamline administration.
            </p>
          </div>
          
          {/* Aesthetic UI preview elements */}
          <div className="pt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition hover:bg-white/10">
              <div className="h-2 w-1/2 bg-blue-500 rounded-full mb-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-white/20 rounded-full" />
                <div className="h-1.5 w-4/5 bg-white/20 rounded-full" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition hover:bg-white/10 mt-6 relative">
              <div className="h-2 w-1/2 bg-purple-500 rounded-full mb-3 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-white/20 rounded-full" />
                <div className="h-1.5 w-3/4 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="absolute inset-0 bg-white" /> {/* Mobile background */}
        
        <div className="w-full max-w-[420px] relative z-10">
          
          {/* Mobile visible logo */}
          <div className="lg:hidden mb-10 inline-flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 shadow-sm" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              School<span className="text-blue-600">SaaS</span>
            </span>
          </div>

          <div className="space-y-2 mb-10 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-1 border border-blue-100/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>SaaS Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 pb-1">
              Sign in with Google
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Start managing your school or college with ease.
            </p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            {/* Google Sign-In Button */}
            <div className="flex justify-center">
              {isGoogleLoading ? (
                <div className="flex items-center gap-3 px-6 py-10 border border-gray-200 rounded-xl bg-gray-50 w-full justify-center">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  <span className="text-sm text-gray-500">Connecting to Google...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-800 shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.74 32.91 29.269 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.656 16.108 19.003 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.164 35.091 26.707 36 24 36c-5.248 0-9.704-3.065-11.27-7.456l-6.52 5.02C9.52 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.75 2.127-2.231 3.927-4.094 5.238l.003-.002 6.19 5.238C36.97 39.152 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                  </svg>
                  Continue with Google
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
