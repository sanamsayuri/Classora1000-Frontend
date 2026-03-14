'use client';

import { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';

export default function SchoolAdminDashboard() {
  const [stats, setStats] = useState({ teachers: 12, parents: 48, students: 156 });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">School Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Teachers</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.teachers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Parents</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.parents}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Students</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">{stats.students}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
        <p className="text-gray-500 mb-4">Manage users or configure your school settings from the menu.</p>
        <div className="flex space-x-4">
          <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-100">
            Export Roster
          </button>
        </div>
      </div>
    </div>
  );
}
