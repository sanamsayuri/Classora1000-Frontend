'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUpWithEmail(formData.email, formData.password, formData.fullName);
      // After signup, they might need to confirm email or they are signed in.
      // The middleware/AuthContext will handle redirection.
      // If email confirmation is off, they go to /onboarding.
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e?.message || 'Google sign-in failed');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50">
      {/* Left side: Premium Branding (Symmetric to Login) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#09090b] overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent blur-3xl" />
        
        <div className="relative z-10 w-full max-w-lg p-12 space-y-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg shadow-blue-500/20" />
            <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              School<span className="text-blue-400">SaaS</span>
            </span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl font-medium tracking-tight text-white leading-tight">
              Empower your institution <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">with modern tools.</span>
            </h2>
            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-md">
              Join thousands of educators who have transformed their campus management with our intelligent platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
             <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                   </div>
                   <div className="h-2 w-32 bg-white/20 rounded-full" />
                </div>
                <div className="space-y-3">
                   <div className="h-1.5 w-full bg-white/10 rounded-full" />
                   <div className="h-1.5 w-4/5 bg-white/10 rounded-full" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="absolute inset-0 bg-white" />
        
        <div className="w-full max-w-[440px] relative z-10">
          
          <div className="lg:hidden mb-10 inline-flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 shadow-sm" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              School<span className="text-blue-600">SaaS</span>
            </span>
          </div>

          <div className="space-y-2 mb-8 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 pb-1">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Start your journey towards better institution management.
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/50 text-gray-900"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@school.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/50 text-gray-900"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/50 text-gray-900"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Confirm</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition bg-gray-50/50 text-gray-900"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Sign Up'}
              </button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-medium tracking-wider">Or register with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition text-sm font-medium text-gray-800 shadow-sm disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.74 32.91 29.269 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.656 16.108 19.003 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.164 35.091 26.707 36 24 36c-5.248 0-9.704-3.065-11.27-7.456l-6.52 5.02C9.52 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.75 2.127-2.231 3.927-4.094 5.238l.003-.002 6.19 5.238C36.97 39.152 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                  </svg>
                  Google
                </>
              )}
            </button>
          </div>
          
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500">
              Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
