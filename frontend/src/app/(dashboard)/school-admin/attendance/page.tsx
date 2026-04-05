'use client';

import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Clock, Calendar, Search } from 'lucide-react';

export default function AdminAttendancePage() {
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Student Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // Student History Modal/View
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentHistory, setStudentHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/attendance/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Search Students
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/students?search=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.students || []);
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setSearching(false);
    }
  };

  // Fetch Student History
  const viewHistory = async (student: any) => {
    setSelectedStudent(student);
    setLoadingHistory(true);
    setStudentHistory([]);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/attendance/student/${student.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudentHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const closeHistory = () => {
    setSelectedStudent(null);
    setStudentHistory([]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Attendance Overview</h2>

      {/* Stats Cards */}
      {loadingStats ? (
        <div className="text-gray-500">Loading today's stats...</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Marked Today</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalMarked}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Present (inc. Late)</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-800">{stats.presentCount + stats.lateCount}</p>
                <span className="text-sm text-green-600 font-medium">{stats.presentPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-4">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-gray-800">{stats.absentCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500 mb-2">Other Statuses</p>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-yellow-600 font-semibold bg-yellow-50 px-2 py-1 rounded">Leave: {stats.leaveCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded">Half Day: {stats.halfDayCount}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Search & Results */}
        <div className="lg:col-span-1 border border-gray-100 bg-white rounded-xl shadow-sm p-6 overflow-hidden flex flex-col h-[600px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            Student Search
          </h3>
          
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by name or admission number..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button 
              type="submit" 
              className="mt-2 w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-lg font-medium transition-colors"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {searchResults.length === 0 && !searching && (
              <p className="text-sm text-gray-500 text-center mt-8">No students found. Try searching.</p>
            )}
            {searchResults.map((student) => (
              <div 
                key={student.id} 
                onClick={() => viewHistory(student)}
                className={`p-3 rounded-lg border cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all ${selectedStudent?.id === student.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="font-medium text-gray-800">{student.first_name} {student.last_name}</div>
                <div className="text-xs text-gray-500 flex justify-between mt-1">
                  <span>{student.admission_number}</span>
                  <span>{student.section?.class?.name} - {student.section?.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Student History */}
        <div className="lg:col-span-2 border border-gray-100 bg-white rounded-xl shadow-sm p-6 flex flex-col h-[600px]">
          {selectedStudent ? (
            <>
              <div className="flex justify-between items-start mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Adm No: {selectedStudent.admission_number} | Class: {selectedStudent.section?.class?.name} - {selectedStudent.section?.name}
                  </p>
                </div>
                <button 
                  onClick={closeHistory} 
                  className="text-sm text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded"
                >
                  Close
                </button>
              </div>

              {loadingHistory ? (
                <div className="flex-1 flex justify-center items-center text-gray-500">Loading history...</div>
              ) : studentHistory.length > 0 ? (
                <div className="flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentHistory.map((record) => {
                      const date = new Date(record.record_date).toLocaleDateString('en-GB', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      });
                      
                      let statusClasses = 'bg-gray-50 text-gray-700 border-gray-200';
                      if (record.status === 'PRESENT') statusClasses = 'bg-green-50 text-green-700 border-green-200';
                      if (record.status === 'ABSENT') statusClasses = 'bg-red-50 text-red-700 border-red-200';
                      if (record.status === 'LEAVE') statusClasses = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                      if (record.status === 'LATE' || record.status === 'HALF_DAY') statusClasses = 'bg-orange-50 text-orange-700 border-orange-200';

                      return (
                        <div key={record.id} className="p-4 rounded-lg border border-gray-100 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                              <Calendar className="w-4 h-4" /> {date}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded border ${statusClasses}`}>
                              {record.status}
                            </span>
                          </div>
                          {record.remarks && (
                            <p className="text-sm text-gray-500 mt-3 pt-3 border-t">
                              <span className="font-medium text-gray-700">Remarks:</span> {record.remarks}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
                  <Clock className="w-12 h-12 text-gray-300 mb-3" />
                  <p>No attendance records found for this student.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
              <Users className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-lg">Select a student to view their attendance history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
