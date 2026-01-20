// const StudentList = ({ payments }) => {
//   if (payments.length === 0) return null;

//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-2">Recent Payments</h2>
//       <div className="overflow-x-auto">
//         <table className="w-full table-auto border">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2">Student ID</th>
//               <th className="p-2">Student Name</th>
//               <th className="p-2">Class</th>
//               <th className="p-2">Status</th>
//               <th className="p-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map((p) => (
//               <tr key={p.id} className="border-t">
//                 <td className="p-2">{p.id}</td>
//                 <td className="p-2">{p.name}</td>
//                 <td className="p-2">{p.class}</td>
//                 <td className="p-2">
//                   <span className="px-2 py-1 rounded bg-green-500 text-white">
//                     Paid
//                   </span>
//                 </td>
//                 <td className="p-2">
//                   <button className="text-blue-600">View</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StudentList;
