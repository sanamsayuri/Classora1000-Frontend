'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export type UserRole = 'admin' | 'teacher' | 'staff';

export interface AppUserDoc {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_name: string;
  approved: boolean;
  is_super_admin: boolean;
  created_at: string;
}

interface AuthContextValue {
  supabaseUser: User | null;
  appUser: AppUserDoc | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();

  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (mounted) {
          setSupabaseUser(null);
          setAppUser(null);
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setSupabaseUser(session.user);
        try {
          const res = await fetch('/api/user/me');
          if (res.ok) {
            const { user: prismaUser } = await res.json();
            setAppUser(prismaUser);
          } else {
            setAppUser(null);
          }
        } catch (e) {
          setAppUser(null);
        }
        setLoading(false);
      }
    }

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setSupabaseUser(null);
        setAppUser(null);
        // router.push('/login'); // Removed to avoid conflict with middleware
      } else if (session && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        setSupabaseUser(session.user);
        try {
          const res = await fetch('/api/user/me');
          if (res.ok) {
            const { user: prismaUser } = await res.json();
            setAppUser(prismaUser);
          }
        } catch (e) {}
        router.refresh();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      supabaseUser,
      appUser,
      loading,
      signInWithGoogle: async () => {
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/api/auth/callback`
          }
        });
      },
      signInWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      },
      signUpWithEmail: async (email, password, fullName) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
      },
      logout: async () => {
        await supabase.auth.signOut();
        router.push('/login');
      },
    }),
    [supabaseUser, appUser, loading, supabase, router]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
