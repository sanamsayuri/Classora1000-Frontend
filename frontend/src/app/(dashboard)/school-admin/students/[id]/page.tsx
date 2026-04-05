'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Upload, User, Mail, Phone, Calendar, MapPin, Droplets, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';

export default function StudentProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const data = await fetchApi(`/students/${id}`);
        setStudent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadStudent();
  }, [id]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/students/${id}/photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      setStudent((prev: any) => ({ ...prev, photo_url: result.photo_url }));
    } catch (err) {
      alert('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/school-admin/students" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="text-gray-500" size={24} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
            <p className="text-gray-500 text-sm mt-1">Detailed information and records</p>
          </div>
        </div>
        <Link href={`/school-admin/students/${id}/edit`} 
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
          <Edit size={16} />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Photo & Quick Info */}
        <div className="space-y-6 md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="relative group mb-4">
              {student.photo_url ? (
                <img src={student.photo_url} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-4xl border-4 border-gray-50 shadow-sm">
                  {student.first_name[0]}{student.last_name[0]}
                </div>
              )}
              <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload size={16} className="text-gray-600" />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{student.first_name} {student.last_name}</h3>
            <p className="text-blue-600 font-medium text-sm mt-1">{student.admission_number}</p>
            {uploading && <p className="text-xs text-blue-500 mt-2">Uploading photo...</p>}
            
            <div className="w-full h-px bg-gray-100 my-6"></div>
            
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <BookOpen size={18} className="text-gray-400" />
                <span className="text-sm">{student.section ? `Class ${student.section.class.name} - Sec ${student.section.name}` : 'Unassigned Class'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={18} className="text-gray-400" />
                <span className="text-sm">Enrolled: {new Date(student.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="space-y-6 md:col-span-2">
          {/* Personal Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-gray-400" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date of Birth</p>
                <p className="text-sm text-gray-800 mt-1 font-medium">{student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Gender</p>
                <p className="text-sm text-gray-800 mt-1 font-medium">{student.gender || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Blood Group</p>
                <p className="text-sm text-gray-800 mt-1 font-medium flex items-center gap-1">
                  <Droplets size={14} className="text-red-500" />
                  {student.blood_group || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Roll Number</p>
                <p className="text-sm text-gray-800 mt-1 font-medium">{student.roll_number || '-'}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Phone size={20} className="text-gray-400" />
              Contact Details
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm text-gray-800 mt-1">{student.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm text-gray-800 mt-1">{student.contact_number || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Residential Address</p>
                  <p className="text-sm text-gray-800 mt-1 leading-relaxed">{student.address || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
