'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { firebaseUser, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    roleRequested: 'teacher',
    organizationName: '',
    phoneNumber: '',
    additionalMetadata: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;

    setLoading(true);
    setError('');

    try {
      const token = await firebaseUser.getIdToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      
      const response = await fetch(`${API_URL}/approval/request-approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit registration');
      }

      // Success! Refresh page to let AuthContext route to /pending-approval
      window.location.href = '/pending-approval';
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete your profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide additional details to request account approval.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="roleRequested" className="block text-sm font-medium text-gray-700">Role Requested</label>
              <select
                id="roleRequested"
                required
                className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.roleRequested}
                onChange={(e) => setFormData({...formData, roleRequested: e.target.value})}
              >
                <option value="admin">School Admin</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization / School Name</label>
              <input
                id="organizationName"
                type="text"
                required
                className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.organizationName}
                onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                required
                className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="additionalMetadata" className="block text-sm font-medium text-gray-700">Additional Information (Optional)</label>
              <textarea
                id="additionalMetadata"
                rows={3}
                className="mt-1 appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.additionalMetadata}
                onChange={(e) => setFormData({...formData, additionalMetadata: e.target.value})}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Registration Request'}
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel and Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
