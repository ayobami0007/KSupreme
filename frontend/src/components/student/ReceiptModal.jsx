// import React from "react";
// import logo from "../../assets/logo.png";
// import { useTerm } from "../../context/TermContext";

// const ReceiptModal = ({ isOpen, onClose, payment, student }) => {
//   const {activeTerm, loading} = useTerm();
//   if (!isOpen || !payment || !student) return null;
// if (loading) return null;
//   const receiptNumber = `REC-${student.id}-${payment.id}`;

//   return (
//     <>
//       {/* Backdrop */}
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-40 print:hidden"></div>

//       {/* Receipt Content */}
//       <div className="receipt-content fixed inset-0 flex items-center justify-center z-50">
//         <div className="bg-white border-4 border-blue-700 w-full max-w-md rounded shadow-lg overflow-hidden print:w-full print:max-w-none print:shadow-none p-6 text-sm">

//           {/* Header */}
//           <div className="flex justify-between items-center bg-blue-700 text-white p-2">
//             <div className="text-center flex-1">
//               <img src={logo} alt="School Logo" className="h-12 mx-auto mb-1" />
//               <h2 className="text-lg font-bold">
//                 {student.section === "Primary"
//                   ? "Supreme Kiddies Nursery and Primary School"
//                   : "Supreme College"}
//               </h2>
//               <p>Opomalu Ilorin</p>
//               <div className="mt-1 flex justify-between text-xs">
//                 <span>Date: {new Date(payment.payment_date).toLocaleDateString()}</span>
//                 <span>Receipt No: {receiptNumber}</span>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="ml-2 text-white text-lg font-bold hover:text-gray-300 print:hidden"
//             >
//               ✕
//             </button>
//           </div>

//           {/* Title */}
//           <h3 className="text-center font-bold text-base text-blue-700 my-4">
//             SCHOOL FEES RECEIPT
//           </h3>

//           {/* Details in Table */}
//           <table className="w-full border border-gray-300 text-sm">
//             <tbody>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold w-1/3">Student Name</td>
//                 <td className="p-2">{student.name}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Class</td>
//                 <td className="p-2">{student.class} - {student.section}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Term</td>
//                 <td className="p-2">{activeTerm?.term}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Payment Mode</td>
//                 <td className="p-2">{payment.payment_mode}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Amount Paid</td>
//                 <td className="p-2">₦{Number(payment.amount_paid).toLocaleString()}</td>
//               </tr>
//               <tr className="border-b">
//                 <td className="p-2 font-semibold">Balance</td>
//                 <td className="p-2">₦{Number(student.balance).toLocaleString()}</td>
//               </tr>
//               <tr>
//                 <td className="p-2 font-semibold">Description</td>
//                 <td className="p-2"> School Fees for {activeTerm?.term}</td>
//               </tr>
//             </tbody>
//           </table>

//           {/* Footer */}
//           <div className="mt-6 space-y-4">
//             <p><strong>Total Amount Paid:</strong> ₦{Number(student.total_paid).toLocaleString()}</p>
//             <div className="flex justify-between mt-6 text-xs text-gray-600">
//               <div>
//                 <p>Authorized Signature:</p>
//                 <div className="border-t border-gray-400 w-32 mt-1"></div>
//               </div>
//               <div>
//                 <p>School Stamp:</p>
//                 <div className="border-t border-gray-400 w-32 mt-1"></div>
//               </div>
//             </div>
//           </div>

//           {/* Print Button */}
//           <div className="mt-6 flex justify-center print:hidden">
//             <button
//               onClick={() => window.print()}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Print Receipt
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Print-only styling */}
//       <style>
//         {`
//           @media print {
//             body * {
//               visibility: hidden;
//             }
//             .receipt-content, .receipt-content * {
//               visibility: visible;
//             }
//             .receipt-content {
//               position: absolute;
//               top: 0;
//               left: 0;
//               width: 100%;
//             }
//           }
//         `}
//       </style>
//     </>
//   );
// };

// export default ReceiptModal;
import React from "react";
import logo from "../../assets/logo.png";
import { useTerm } from "../../context/TermContext";

const ReceiptModal = ({ isOpen, onClose, payment, student }) => {
  const { activeTerm, loading } = useTerm();
  if (!isOpen || !payment || !student) return null;
  if (loading) return null;

  const receiptNumber = `REC-${student.id}-${payment.id}`;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 print:hidden"></div>

      {/* Receipt Content */}
      <div className="receipt-content fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white border-4 border-blue-700 w-full max-w-md rounded shadow-lg overflow-hidden print:w-full print:max-w-none print:shadow-none p-6 text-sm">

          {/* Header */}
          <div className="text-center mb-4">
            <img src={logo} alt="School Logo" className="h-12 mx-auto mb-1" />
            <h2 className="text-lg font-bold">
              {student.section === "Primary"
                ? "Supreme Kiddies Nursery and Primary School"
                : "Supreme College"}
            </h2>
            <p>Opomalu, Ilorin</p>
          </div>

          {/* Receipt Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div><strong>Receipt Number:</strong> {receiptNumber}</div>
            <div><strong>Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}</div>
          </div>

          {/* Student Info */}
          <div className="space-y-1 text-sm mb-4">
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Class:</strong> {student.class} - {student.section}</p>
            <p><strong>Term:</strong> {activeTerm?.term}</p>
          </div>

          {/* Payment Breakdown Table */}
          <table className="w-full border border-gray-300 text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Payment Mode</th>
                <th className="p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">School Fees for {activeTerm?.term}</td>
                <td className="p-2">{payment.payment_mode}</td>
                <td className="p-2">₦{Number(payment.amount_paid).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div><strong>Total Amount Paid:</strong> ₦{Number(student.total_paid).toLocaleString()}</div>
            <div><strong>Balance:</strong> ₦{Number(student.balance).toLocaleString()}</div>
          </div>

          {/* Signature & Stamp */}
          <div className="flex justify-between mt-6 text-xs text-gray-600">
            <div>
              <p>Authorized Signature:</p>
              <div className="border-t border-gray-400 w-32 mt-1"></div>
            </div>
            <div>
              <p>School Stamp:</p>
              <div className="border-t border-gray-400 w-32 mt-1"></div>
            </div>
          </div>

          {/* Motto */}
          <div className="mt-8 text-center text-xs italic text-gray-600">
            “Knowledge, Discipline, Excellence”
          </div>

          {/* Print Button */}
          <div className="mt-6 flex justify-center print:hidden">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Print-only styling */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .receipt-content, .receipt-content * {
              visibility: visible;
            }
            .receipt-content {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </>
  );
};

export default ReceiptModal;
