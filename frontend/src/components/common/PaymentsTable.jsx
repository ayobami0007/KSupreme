import React from "react";

const PaymentsTable = ({ payments }) => (
  <>
    <h2 className="text-2xl font-semibold mb-4 mt-8">Recent Payments</h2>

    <div className="bg-white shadow rounded">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Student Name</th>
            <th className="p-2">Class</th>
            <th className="p-2">Amount Paid</th>
            <th className="p-2">Payment Mode</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.class}</td>
              <td className="p-2">{p.amount}</td>
              <td className="p-2">{p.mode}</td>
              <td className="p-2">{p.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

export default PaymentsTable;
