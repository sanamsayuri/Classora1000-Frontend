'use client';

import { useState, useEffect } from 'react';

export default function TeacherAttendancePage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: string; remarks: string }>>({});
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setClasses(data);
        }
      } catch (err) {
        console.error('Failed to fetch classes', err);
      }
    };
    fetchClasses();
  }, []);

  // Fetch sections when class changes
  useEffect(() => {
    if (!selectedClass) {
      setSections([]);
      setSelectedSection('');
      return;
    }
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5001/api/sections?class_id=${selectedClass}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSections(data);
        }
      } catch (err) {
        console.error('Failed to fetch sections', err);
      }
    };
    fetchSections();
  }, [selectedClass]);

  const loadStudentsAndAttendance = async () => {
    if (!selectedSection || !recordDate) return;
    
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      
      // Fetch students in the section
      const studentsRes = await fetch(`http://localhost:5001/api/students?section_id=${selectedSection}&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const studentsData = await studentsRes.json();
      const sectionStudents = studentsData.students || [];

      // Fetch existing attendance
      const attendanceRes = await fetch(`http://localhost:5001/api/attendance?section_id=${selectedSection}&record_date=${recordDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const existingRecords = await attendanceRes.json();
      
      const recordsMap: Record<string, { status: string; remarks: string }> = {};
      
      sectionStudents.forEach((student: any) => {
        const existing = existingRecords.find((r: any) => r.student_id === student.id);
        recordsMap[student.id] = {
          status: existing ? existing.status : 'PRESENT', // default to PRESENT
          remarks: existing?.remarks || ''
        };
      });

      setStudents(sectionStudents);
      setAttendanceRecords(recordsMap);
    } catch (err) {
      console.error('Load failed', err);
      setMessage('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const markAll = (status: string) => {
    const updated = { ...attendanceRecords };
    Object.keys(updated).forEach(id => {
      updated[id].status = status;
    });
    setAttendanceRecords(updated);
  };

  const saveAttendance = async () => {
    if (!selectedSection || !recordDate || students.length === 0) return;
    
    setSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const payload = {
        section_id: selectedSection,
        record_date: recordDate,
        records: Object.keys(attendanceRecords).map(student_id => ({
          student_id,
          status: attendanceRecords[student_id].status,
          remarks: attendanceRecords[student_id].remarks,
        }))
      };

      const res = await fetch('http://localhost:5001/api/attendance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMessage('Attendance saved successfully!');
      } else {
        const err = await res.json();
        setMessage(`Error: ${err.error || 'Failed to save'}`);
      }
    } catch (err) {
      setMessage('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Mark Attendance</h2>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select 
            value={selectedSection} 
            onChange={e => setSelectedSection(e.target.value)}
            disabled={!selectedClass}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select Section</option>
            {sections.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input 
            type="date" 
            value={recordDate}
            onChange={e => setRecordDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          onClick={loadStudentsAndAttendance}
          disabled={!selectedSection || !recordDate || loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Load Students'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center justify-between ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <span>{message}</span>
          <button onClick={() => setMessage('')} className="text-sm font-medium hover:underline">Dismiss</button>
        </div>
      )}

      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Students List ({students.length})</h3>
            <div className="space-x-2">
              <span className="text-sm text-gray-500 mr-2">Mark All:</span>
              <button onClick={() => markAll('PRESENT')} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200">Present</button>
              <button onClick={() => markAll('ABSENT')} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200">Absent</button>
              <button onClick={() => markAll('LEAVE')} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200">Leave</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="p-4 font-medium text-gray-600 whitespace-nowrap">Roll No.</th>
                  <th className="p-4 font-medium text-gray-600">Student Name</th>
                  <th className="p-4 font-medium text-gray-600 w-48">Status</th>
                  <th className="p-4 font-medium text-gray-600 w-64">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-800 font-medium">{student.roll_number || '-'}</td>
                    <td className="p-4 text-gray-800">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                          {student.first_name[0]}{student.last_name[0]}
                        </div>
                        {student.first_name} {student.last_name}
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={attendanceRecords[student.id]?.status || 'PRESENT'}
                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        className={`w-full p-2 border rounded-md text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 ${
                          attendanceRecords[student.id]?.status === 'PRESENT' ? 'bg-green-50 text-green-700 border-green-200' :
                          attendanceRecords[student.id]?.status === 'ABSENT' ? 'bg-red-50 text-red-700 border-red-200' :
                          attendanceRecords[student.id]?.status === 'LEAVE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-orange-50 text-orange-700 border-orange-200' // LATE or HALF_DAY
                        }`}
                      >
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LEAVE">Leave</option>
                        <option value="LATE">Late</option>
                        <option value="HALF_DAY">Half Day</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <input 
                        type="text"
                        placeholder="Optional remarks"
                        value={attendanceRecords[student.id]?.remarks || ''}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="w-full p-2 text-sm border border-gray-200 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 flex justify-end">
            <button 
              onClick={saveAttendance}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
            >
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
