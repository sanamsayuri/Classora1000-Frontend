"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ParentFeesPage() {
  const [dues, setDues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDues = async () => {
    try {
      setLoading(true);
      const data = await fetchApi("/fees/dues");
      setDues(data);
    } catch (error) {
      console.error("Error fetching dues:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDues();

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (feeId: string, amount: number) => {
    try {
      // 1. Create order
      const orderRes = await fetchApi("/payments/fees/order", {
         method: "POST",
         body: JSON.stringify({ fee_payment_id: feeId })
      });
      const { order, feeDetails } = orderRes;

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY', // Use env in prod
        amount: order.amount,
        currency: order.currency,
        name: "School SaaS",
        description: "Fee Payment",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            await fetchApi("/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });
            alert("Payment Successful!");
            fetchDues(); // Refresh dues list
          } catch (verifyError) {
            console.error("Verification failed", verifyError);
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: "Parent Name", // Ideally from user profile
          email: "parent@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#4F46E5" // indigo-600
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert(error.message || "Error initiating payment");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dues...</div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 border-b pb-4">Pending Fees</h1>

      {dues.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700">All Caught Up!</h2>
              <p className="text-gray-500">There are no pending fees for your children at this time.</p>
          </div>
      ) : (
          <div className="space-y-4">
              {dues.map((due: any) => (
                  <div key={due.id} className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      <div>
                          <div className="flex items-center space-x-3 mb-2">
                              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Due</span>
                              <h3 className="font-semibold text-lg text-gray-800">{due.fee_structure.fee_name}</h3>
                          </div>
                          <p className="text-gray-600">Student: <strong>{due.student.first_name} {due.student.last_name}</strong></p>
                          <p className="text-sm text-gray-500 mt-1">Period: {due.fee_period} | Due: {new Date(due.due_date).toLocaleDateString()}</p>
                          
                          {due.computed_late_fee > 0 && (
                              <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 inline-block px-2 py-1 rounded">
                                  + ₹{due.computed_late_fee} Late Fee applied
                              </p>
                          )}
                      </div>
                      
                      <div className="text-left md:text-right w-full md:w-auto">
                          <p className="text-3xl font-bold text-gray-900 mb-4 inline-block md:block">
                              ₹{due.total_payable}
                          </p>
                          <button 
                              onClick={() => handlePayment(due.id, due.total_payable)}
                              className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-md"
                          >
                              Pay Securely
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
}
