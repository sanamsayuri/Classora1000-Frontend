'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

export default function OnboardingPage() {
  const router = useRouter();
  const { firebaseUser } = useAuth();
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolType: 'SCHOOL',
    address: '',
    contactNumber: '',
    role: 'ADMIN',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!firebaseUser) router.replace('/login');
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!firebaseUser || !firebaseUser.uid || !firebaseUser.email) {
        throw new Error('You must be signed in with Google to continue.');
      }

      // Create a school document with a deterministic ID so security rules can validate it.
      const schoolId = `school_${firebaseUser.uid}`;

      await setDoc(
        doc(db, 'schools', schoolId),
        {
          id: schoolId,
          name: formData.schoolName.trim(),
          type: formData.schoolType,
          address: formData.address.trim(),
          contactNumber: formData.contactNumber.trim(),
          createdBy: firebaseUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, 'users', firebaseUser.uid),
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || null,
          schoolId,
          role: 'ADMIN',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // After onboarding, send admins to the school admin area.
      router.replace('/school-admin');
    } catch (err: any) {
      setError(err.message || 'Onboarding failed');
      setIsLoading(false);
    }
  };

  if (!firebaseUser) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete your setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome, {firebaseUser.displayName || 'there'}! Just a few more details to create your school.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">School Name</label>
              <input
                id="schoolName"
                name="schoolName"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Greenwood Academy"
                value={formData.schoolName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="schoolType" className="block text-sm font-medium text-gray-700">School Type</label>
              <select
                id="schoolType"
                name="schoolType"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={formData.schoolType}
                onChange={handleChange}
              >
                <option value="SCHOOL">School</option>
                <option value="COLLEGE">College</option>
                <option value="COACHING">Coaching Institute</option>
              </select>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address (City, State, Country)</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="New York, NY, USA"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="+1 234 567 8900"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-b-md"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating School...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
