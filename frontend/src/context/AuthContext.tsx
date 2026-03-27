'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

export type SchoolType = 'SCHOOL' | 'COLLEGE' | 'COACHING';

export type UserRole = 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT' | 'SUPER_ADMIN';

export interface AppUserDoc {
  uid: string;
  email: string;
  name: string;
  photoURL?: string | null;
  schoolId?: string;
  role?: UserRole;
  roleRequested?: string;
  roleAssigned?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  organizationName?: string;
  phoneNumber?: string;
  createdAt: unknown;
  updatedAt?: unknown;
}

interface AuthContextValue {
  firebaseUser: User | null;
  appUser: AppUserDoc | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const PUBLIC_PATHS = new Set<string>(['/', '/login', '/register', '/pending-approval']);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUserDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);

      if (!u) {
        setAppUser(null);
        setLoading(false);
        if (!PUBLIC_PATHS.has(pathname)) router.replace('/login');
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (!snap.exists()) {
          setAppUser(null);
          setLoading(false);
          if (pathname !== '/register') router.replace('/register');
          return;
        }

        const userDoc = snap.data() as AppUserDoc;
        setAppUser(userDoc);
        setLoading(false);

        if (pathname === '/login' || pathname === '/register') {
          // Check approval status first
          if (userDoc.approvalStatus === 'pending' || userDoc.approvalStatus === 'rejected') {
            router.replace('/pending-approval');
            return;
          }

          // Route approved users to the correct dashboard based on assigned role.
          const actualRole = userDoc.roleAssigned || userDoc.role;
          const targetPath =
            actualRole === 'SUPER_ADMIN' || actualRole === 'admin' || actualRole === 'ADMIN'
              ? '/super-admin'
              : actualRole === 'TEACHER' || actualRole === 'teacher'
                ? '/teacher'
                : '/school-admin'; // default fallback
          router.replace(targetPath);
        } else if (
          (userDoc.approvalStatus === 'pending' || userDoc.approvalStatus === 'rejected') &&
          pathname !== '/pending-approval' &&
          !PUBLIC_PATHS.has(pathname)
        ) {
          router.replace('/pending-approval');
        }
      } catch {
        setAppUser(null);
        setLoading(false);
        if (pathname !== '/login') router.replace('/login');
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, pathname]);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      appUser,
      loading,
      signInWithGoogle: async () => {
        googleProvider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(auth, googleProvider as GoogleAuthProvider);
      },
      logout: async () => {
        await signOut(auth);
        router.replace('/login');
      },
    }),
    [firebaseUser, appUser, loading, router]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

