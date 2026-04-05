"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

export default function AdminFeesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [feeRecords, setFeeRecords] = useState<any[]>([]);
  
  // Form State for new structure
  const [feeName, setFeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");
  const [dueDay, setDueDay] = useState("10");

  // Form State for invoice generation
  const [dueDate, setDueDate] = useState("");
  const [feePeriod, setFeePeriod] = useState("");

  const fetchClasses = async () => {
    try {
      const data = await fetchApi("/classes");
      setClasses(data);
      if (data.length > 0) setSelectedClass(data[0].id);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchFeeStructures = async () => {
    if (!selectedClass) return;
    try {
      const data = await fetchApi(`/fees/structures?class_id=${selectedClass}`);
      setFeeStructures(data);
    } catch (error) {
      console.error("Error fetching fee structures:", error);
    }
  };

  const fetchFeeRecords = async () => {
    if (!selectedClass) return;
    try {
      const data = await fetchApi(`/fees/records?class_id=${selectedClass}`);
      setFeeRecords(data);
    } catch (error) {
      console.error("Error fetching fee records:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchFeeStructures();
    fetchFeeRecords();
  }, [selectedClass]);

  const handleCreateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi("/fees/structures", {
        method: "POST",
        body: JSON.stringify({
          class_id: selectedClass,
          fee_name: feeName,
          amount: parseFloat(amount),
          frequency,
          due_day: parseInt(dueDay)
        })
      });
      fetchFeeStructures();
      setFeeName("");
      setAmount("");
    } catch (error) {
       alert("Failed to create fee structure");
    }
  };

  const handleGenerateRecords = async (structureId: string) => {
    if (!dueDate || !feePeriod) {
        alert("Please set Due Date and Fee Period to generate invoices.");
        return;
    }
    
    try {
        await fetchApi("/fees/generate", {
            method: "POST",
            body: JSON.stringify({
              class_id: selectedClass,
              fee_structure_id: structureId,
              due_date: dueDate,
              fee_period: feePeriod
            })
        });
        alert("Invoices generated successfully!");
        fetchFeeRecords();
    } catch(err: any) {
        alert(err.message || "Failed to generate invoices");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
        <select 
            className="border p-2 rounded-lg bg-white shadow-sm"
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
        >
            <option value="">Select Class</option>
            {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Fee Structure */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Fee Structure</h2>
              <form onSubmit={handleCreateStructure} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Fee Name (e.g., Tuition Fee)</label>
                      <input required type="text" className="w-full border p-2 rounded-lg" value={feeName} onChange={e => setFeeName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Amount (₹)</label>
                          <input required type="number" className="w-full border p-2 rounded-lg" value={amount} onChange={e => setAmount(e.target.value)} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Frequency</label>
                          <select className="w-full border p-2 rounded-lg" value={frequency} onChange={e => setFrequency(e.target.value)}>
                              <option value="MONTHLY">Monthly</option>
                              <option value="TERMLY">Termly</option>
                              <option value="YEARLY">Yearly</option>
                              <option value="ONE_TIME">One Time</option>
                          </select>
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Default Due Day of Month</label>
                      <input type="number" className="w-full border p-2 rounded-lg" value={dueDay} onChange={e => setDueDay(e.target.value)} />
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                      Save Structure
                  </button>
              </form>
          </div>

          {/* List Fee Structures & Generate Button */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Existing Structures</h2>
              {feeStructures.length === 0 ? (
                  <p className="text-gray-500">No fee structures defined for this class.</p>
              ) : (
                  <div className="space-y-4">
                     {feeStructures.map((structure: any) => (
                         <div key={structure.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col space-y-3">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{structure.fee_name}</h3>
                                    <p className="text-sm text-gray-500">₹{structure.amount} / {structure.frequency.toLowerCase()}</p>
                                </div>
                             </div>
                             
                             {/* Generate Invoice Controls */}
                             <div className="pt-3 border-t border-gray-200 grid grid-cols-1 gap-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase">Generate Invoices</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="text" placeholder="Period (e.g. April 2026)" className="border p-2 rounded-md text-sm" value={feePeriod} onChange={e => setFeePeriod(e.target.value)} />
                                    <input type="date" className="border p-2 rounded-md text-sm" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                                </div>
                                <button 
                                    onClick={() => handleGenerateRecords(structure.id)}
                                    className="w-full bg-emerald-500 text-white p-2 rounded-md text-sm font-medium hover:bg-emerald-600 transition"
                                >
                                    Generate for All Students
                                </button>
                             </div>
                         </div>
                     ))}
                  </div>
              )}
          </div>
      </div>

      {/* Fee Records List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Generated Fee Records</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                        <th className="p-3">Student</th>
                        <th className="p-3">Fee Type</th>
                        <th className="p-3">Period</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {feeRecords.map((record: any) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50 transition">
                            <td className="p-3">
                                {record.student.first_name} {record.student.last_name}
                                <br/><span className="text-xs text-gray-500">{record.student.admission_number}</span>
                            </td>
                            <td className="p-3">{record.fee_structure.fee_name}</td>
                            <td className="p-3">{record.fee_period}</td>
                            <td className="p-3">{new Date(record.due_date).toLocaleDateString()}</td>
                            <td className="p-3">₹{record.fee_structure.amount}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {record.status === 'SUCCESS' ? 'PAID' : record.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {feeRecords.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-4 text-center text-gray-500">No fee records found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
