
// import React from "react";
// import logo from "../../assets/logo.png";
// import { useTerm } from "../../context/TermContext";
// import html2pdf from "html2pdf.js";
// import { PrinterIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";



// const ReceiptModal = ({ isOpen, onClose, payment, student }) => {
//   const { activeTerm, loading } = useTerm();
//   if (!isOpen || !payment || !student) return null;
//   if (loading) return null;

//   const receiptNumber = `REC-${student.id}-${payment.id}`;

//   const handleDownload = () => {
//   const element = document.querySelector(".receipt-content");
//   const opt = {
//     margin:       0.5,
//     filename:     `receipt-${student.id}.pdf`,
//     image:        { type: 'jpeg', quality: 0.98 },
//     html2canvas:  { scale: 2 },
//     jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
//   };
//   html2pdf().set(opt).from(element).save();
// };


//   return (
//     <>
//       {/* Backdrop */}
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-40 print:hidden"></div>

//       {/* Receipt Content */}
//       <div className="receipt-content fixed inset-0 flex items-center justify-center z-50">
//         <div className="bg-white border-4 border-blue-700 w-full max-w-md rounded shadow-lg overflow-hidden print:w-full print:max-w-none print:shadow-none p-6 text-sm">

//           {/* Header */}
//           <div className="text-center mb-4">
//             <img src={logo} alt="School Logo" className="h-12 mx-auto mb-1" />
//             <h2 className="text-lg font-bold">
//               {student.section === "Primary"
//                 ? "Supreme Kiddies Nursery and Primary School"
//                 : "Supreme College"}
//             </h2>
//             <p>Opomalu, Ilorin</p>
//           </div>
// <hr className="border-gray-300 my-2" />

//           {/* Receipt Metadata */}
//           <div className="grid grid-cols-2 gap-4 text-sm mb-4">
//             <div><strong>Receipt Number:</strong> {receiptNumber}</div>
//             <div><strong>Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}</div>
//           </div>
      


//           {/* Student Info */}
//           <div className="space-y-1 text-sm mb-4">
//             <p><strong>Name:</strong> {student.name}</p>
//             <p><strong>Class:</strong> {student.class} - {student.section}</p>
//             <p><strong>Term:</strong> {activeTerm?.term}</p>
//           </div>
//               <hr className="border-gray-300 my-2" />

//           {/* Payment Breakdown Table */}
//           <table className="w-full border border-gray-300 text-sm mb-4">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 text-left">Description</th>
//                 <th className="p-2 text-left">Payment Mode</th>
//                 <th className="p-2 text-left">Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td className="p-2">School Fees for {activeTerm?.term}</td>
//                 <td className="p-2">{payment.payment_mode}</td>
//                 <td className="p-2">₦{Number(payment.amount_paid).toLocaleString()}</td>
//               </tr>
//             </tbody>
//           </table>

//               <hr className="border-gray-300 my-2" />

//           {/* Totals */}
//           <div className="grid grid-cols-2 gap-4 text-sm mb-6">
//             <div><strong>Total Amount Paid:</strong> ₦{Number(student.total_paid).toLocaleString()}</div>
//             <div><strong>Balance:</strong> ₦{Number(student.balance).toLocaleString()}</div>
//           </div>

//               <hr className="border-gray-300 my-2" />

//           {/* Signature & Stamp */}
//           <div className="flex justify-between mt-6 text-xs text-gray-600">
//             <div>
//               <p>Authorized Signature:</p>
//               <div className="border-t border-gray-400 w-32 mt-1"></div>
//             </div>
//             <div>
//               <p>School Stamp:</p>
//               <div className="border-t border-gray-400 w-32 mt-1"></div>
//             </div>
//           </div>

//           {/* Motto */}
//           <div className="mt-8 text-center text-xs italic text-gray-600">
//             “Knowledge, Discipline, Excellence”
//           </div>

//           {/* Print Button */}
//          <div className="mt-6 flex justify-center space-x-4 print:hidden">
//   <button
//     onClick={() => window.print()}
//     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
//   >
//     <PrinterIcon className="h-5 w-5" />
//     <span className="sr-only">Print Receipt</span>
//   </button>

//   <button
//     onClick={handleDownload}
//     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
//   >
//      <ArrowDownTrayIcon className="h-5 w-5" />
//     <span className="sr-only">Download PDF</span>
//   </button>
// </div>

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
//               width: 50%;
//               height: 50%;
//               margin: auto; 
//               transform: scale(0.5); 
//                transform-origin: top center;
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
import html2pdf from "html2pdf.js";
import { PrinterIcon, ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ReceiptModal = ({ isOpen, onClose, payment, student }) => {
  const { activeTerm, loading } = useTerm();
  if (!isOpen || !payment || !student) return null;
  if (loading) return null;

  const receiptNumber = `REC-${student.id}-${payment.id}`;

  const handleDownload = () => {
    const element = document.getElementById("receipt-box");
    const opt = {
      margin: 0.5,
      filename: `receipt-${student.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 print:hidden"></div>

      {/* Receipt Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          id="receipt-box"
          className="bg-white border-4 border-blue-700 w-full max-w-md rounded shadow-lg overflow-hidden print:w-full print:max-w-none print:shadow-none p-6 text-sm"
        >
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
          <hr className="border-gray-300 my-2" />

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
          <hr className="border-gray-300 my-2" />

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
          <hr className="border-gray-300 my-2" />

          {/* Totals */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div><strong>Total Amount Paid:</strong> ₦{Number(student.total_paid).toLocaleString()}</div>
            <div><strong>Balance:</strong> ₦{Number(student.balance).toLocaleString()}</div>
          </div>
          <hr className="border-gray-300 my-2" />

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

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center space-x-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
            >
              <PrinterIcon className="h-5 w-5" />
              <span className="sr-only">Print Receipt</span>
            </button>

            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span className="sr-only">Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center space-x-2"
            >
              <XMarkIcon className="h-5 w-5" />
              <span className="sr-only">Cancel</span>
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
            #receipt-box, #receipt-box * {
              visibility: visible;
            }
            #receipt-box {
              position: absolute;
              top: 0;
              left: 0;
              width: 50%;
              height: 50%;
              margin: auto;
              transform: scale(0.5);
              transform-origin: top center;
            }
          }
        `}
      </style>
    </>
  );
};

export default ReceiptModal;
