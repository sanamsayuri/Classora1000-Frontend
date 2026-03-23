'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  CreditCard, 
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  Bell
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const attendanceData = [
  { name: 'Mon', present: 95, absent: 5 },
  { name: 'Tue', present: 92, absent: 8 },
  { name: 'Wed', present: 88, absent: 12 },
  { name: 'Thu', present: 96, absent: 4 },
  { name: 'Fri', present: 94, absent: 6 },
];

const feeData = [
  { name: 'Jan', collected: 4000, pending: 2400 },
  { name: 'Feb', collected: 3000, pending: 1398 },
  { name: 'Mar', collected: 2000, pending: 9800 },
  { name: 'Apr', collected: 2780, pending: 3908 },
  { name: 'May', collected: 1890, pending: 4800 },
  { name: 'Jun', collected: 2390, pending: 3800 },
];

export default function SchoolAdminDashboard() {
  const [stats, setStats] = useState({ 
    students: 1245, 
    teachers: 86,
    feeCollected: 85, // percentage
    attendanceToday: 92 // percentage
  });

  // Hydration fix for Recharts (to prevent hydration errors with ResponsiveContainer)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent">
          Download Report
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Students</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.students}</h3>
            <p className="text-xs text-green-600 flex items-center mt-2 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" /> +2.5% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Teachers</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.teachers}</h3>
            <p className="text-xs text-green-600 flex items-center mt-2 font-medium">
              <TrendingUp className="w-3 h-3 mr-1" /> +1 new this month
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Fee Collection</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.feeCollected}%</h3>
            <p className="text-xs text-gray-500 flex items-center mt-2">
              Of total target for term
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Today's Attendance</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.attendanceToday}%</h3>
            <p className="text-xs text-red-500 flex items-center mt-2 font-medium">
              <AlertCircle className="w-3 h-3 mr-1" /> -2% from yesterday
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Fee Collection Overview</h3>
          <div className="h-72">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                  <Bar dataKey="collected" fill="#10B981" radius={[4, 4, 0, 0]} name="Collected" />
                  <Bar dataKey="pending" fill="#F87171" radius={[4, 4, 0, 0]} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Attendance Stats</h3>
          <div className="h-72">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} domain={[80, 100]} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                  <Line type="monotone" dataKey="present" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#3B82F6', strokeWidth: 0}} activeDot={{r: 6}} name="Present %" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Notices Preview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Notices</h3>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { id: 1, title: 'Annual Sports Meet Registration', date: 'Oct 15, 2026', type: 'Event' },
            { id: 2, title: 'Term 1 Report Cards Available', date: 'Oct 12, 2026', type: 'Academic' },
            { id: 3, title: 'School Closed on Friday for Maintenance', date: 'Oct 10, 2026', type: 'Alert' },
          ].map((notice) => (
            <div key={notice.id} className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-md mr-4 ${
                notice.type === 'Event' ? 'bg-purple-100 text-purple-600' : 
                notice.type === 'Academic' ? 'bg-blue-100 text-blue-600' : 
                'bg-red-100 text-red-600'
              }`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{notice.title}</h4>
                <p className="text-xs text-gray-500 mt-1">Published on {notice.date}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                notice.type === 'Event' ? 'bg-purple-50 text-purple-700' : 
                notice.type === 'Academic' ? 'bg-blue-50 text-blue-700' : 
                'bg-red-50 text-red-700'
              }`}>
                {notice.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
