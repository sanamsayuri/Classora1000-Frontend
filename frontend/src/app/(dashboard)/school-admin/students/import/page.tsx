'use client';

import { useState } from 'react';
import { ArrowLeft, UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BulkImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null); // Reset on new file select
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      setResult(null);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/students/import/excel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');
      
      setResult({ success: true, message: data.message });
      setTimeout(() => router.push('/school-admin/students'), 2000);
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'An error occurred during import' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/school-admin/students" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="text-gray-500" size={24} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bulk Import Students</h2>
          <p className="text-gray-500 text-sm mt-1">Upload an Excel (.xlsx) file to register multiple students</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <FileSpreadsheet size={48} className="text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Excel Spreadsheet</h3>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
            Make sure your Excel file contains columns for <span className="font-medium text-gray-700">first_name</span>, <span className="font-medium text-gray-700">last_name</span>, and <span className="font-medium text-gray-700">admission_number</span>.
          </p>
          
          <label className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer flex items-center gap-2">
            <UploadCloud size={18} />
            {file ? file.name : 'Choose Excel File'}
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
          </label>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${result.success ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
            {result.success ? <CheckCircle size={20} className="mt-0.5 text-green-600" /> : <AlertCircle size={20} className="mt-0.5 text-red-600" />}
            <div>
              <p className="font-medium">{result.success ? 'Import Successful' : 'Import Failed'}</p>
              <p className="text-sm mt-1 opacity-90">{result.message}</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4 pt-4 border-t border-gray-100">
          <Link href="/school-admin/students" className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button 
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <UploadCloud size={18} />
            {uploading ? 'Processing...' : 'Start Import'}
          </button>
        </div>
      </div>
    </div>
  );
}
