'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'SUPER_ADMIN') {
        router.push('/super-admin');
      } else if (data.user.role === 'SCHOOL_ADMIN') {
        router.push('/school-admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsLoading(false);
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
              <span>Admin Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 pb-1">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Please enter your details to sign in and manage your campus.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1 group">
              <label className="text-sm font-medium text-gray-700 transition-colors group-focus-within:text-blue-600">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-50 hover:bg-white border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder-gray-400 text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@schoolsaas.com"
              />
            </div>

            <div className="space-y-1 group">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 transition-colors group-focus-within:text-blue-600">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-gray-50 hover:bg-white border border-gray-200 rounded-xl text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 placeholder-gray-400 tracking-widest font-mono text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign in to account'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-gray-900 hover:underline hover:text-blue-600 transition-colors">
                Contact sales
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
