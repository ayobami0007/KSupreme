// import React from "react";

// const PaymentsTable = ({ payments }) => (
//   <>
//     <h2 className="text-2xl font-semibold mb-4 mt-8">Recent Payments</h2>

//     <div className="bg-white shadow rounded">
//       <table className="w-full table-auto">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             <th className="p-2">Student Name</th>
//             <th className="p-2">Class</th>
//             <th className="p-2">Amount Paid</th>
//             <th className="p-2">Payment Mode</th>
//             <th className="p-2">Date</th>
//             <th className="p-2">Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {payments.map((p, idx) => (
//             <tr key={idx} className="border-t">
//               <td className="p-2">{p.name}</td>
//               <td className="p-2">{p.class}</td>
//               <td className="p-2">{p.amount}</td>
//               <td className="p-2">{p.mode}</td>
//               <td className="p-2">{p.date}</td>
//               <td className="p-2">
//                 <span
//                   className={`px-2 py-1 rounded text-xs font-semibold ${p.status === "FULL"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-red-100 text-red-700"
//                     }`}
//                 >
//                   {p.status}
//                 </span>
//               </td>

//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </>
// );

// export default PaymentsTable;
import React from "react";

const PaymentsTable = ({ payments }) => {

  const recentPayments = [...payments]
  .sort((a, b) => new Date(b.date)  - new Date(a.date))
  .slice(0,8)
  return (
  <>
    <h2 className="text-xl sm:text-2xl font-semibold mb-4 mt-8">Recent Payments</h2>

    <div className="bg-white shadow rounded overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left text-sm sm:text-base">
            <th className="p-2 whitespace-nowrap">Student Name</th>
            <th className="p-2 whitespace-nowrap">Class</th>
            <th className="p-2 whitespace-nowrap">Amount Paid</th>
            <th className="p-2 whitespace-nowrap">Payment Mode</th>
            <th className="p-2 whitespace-nowrap">Date</th>
            <th className="p-2 whitespace-nowrap">Status</th>
          </tr>
        </thead>

        <tbody>
          {recentPayments.map((p, idx) => (
            <tr key={idx} className="border-t text-sm sm:text-base">
              <td className="p-2 whitespace-nowrap">{p.name}</td>
              <td className="p-2 whitespace-nowrap">{p.class}</td>
              <td className="p-2 whitespace-nowrap">{p.amount}</td>
              <td className="p-2 whitespace-nowrap">{p.mode}</td>
              <td className="p-2 whitespace-nowrap">{p.date}</td>
              <td className="p-2 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    p.status === "FULL"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  )
};

export default PaymentsTable;

