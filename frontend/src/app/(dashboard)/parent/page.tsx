'use client';

export default function ParentDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Parent Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Students</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">2</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Dues</h3>
          <p className="mt-2 text-3xl font-bold text-red-500">$150.00</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
        <p className="text-gray-500 mb-4">View your children's progress, attendance, and pay fees.</p>
        <div className="flex space-x-4">
          <button className="bg-green-50 text-green-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-green-100">
            Pay Fees
          </button>
          <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-100">
            View Report Cards
          </button>
        </div>
      </div>
    </div>
  );
}
