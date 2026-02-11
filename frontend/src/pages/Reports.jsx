// import React, { useEffect, useState } from 'react'
// import { getPaymentReport } from '../api/students.api'
// import { getClasses } from "../api/classes.api";
// import DropDown from "../components/common/DropDown"
// import Table from "../components/common/Table"
// import Loader from '../components/common/Loader'
// import Button from '../components/common/Button';

// export default function PaymentReportPage() {
//   const [classes, setClasses] = useState([]);
//   const [selectedClasses, setSelectedClasses] = useState("")
//   const [loading, setLoading] = useState(false);
//   const [filter, setFilter] = useState("");
//   const [students, setStudents] = useState([])

//   // Load classes on mount
//   useEffect(() => {
//     const loadClasses = async () => {
//       try {
//         const data = await getClasses();
//         setClasses(data)
//       } catch (err) {
//         console.error("failed to load classes", err)
//       }
//     };
//     loadClasses();
//   }, [])

//   // Load report
//   const loadReport = async () => {
//     if (!selectedClasses) {
//       alert("Please select a class");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const data = await getPaymentReport({
//         classId: selectedClasses,
//         paymentStatus: filter
//       })
//       setStudents(data);
//     } catch (err) {
//       console.error("Error fetching report:", err);
//       alert("Failed to load report. Please try again.");
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Print function
//   const handlePrint = () => {
//     window.print();
//   }

//   // Format display for amount/status
//   const formatAmountDisplay = (student) => {
//     if (student.payment_status === "Fully Paid") {
//       return "Fully Paid";
//     } else if (student.payment_status === "Not Paid") {
//       return "Not Paid";
//     } else {
//       return `₦${parseFloat(student.balance).toLocaleString()} left`;
//     }
//   }

//   // Table data for desktop
//   const tableData = students.map((student, index) => [
//     index + 1,
//     student.name,
//     student.class,
//     `₦${parseFloat(student.total_fee).toLocaleString()}`,
//     `₦${parseFloat(student.total_paid).toLocaleString()}`,
//     formatAmountDisplay(student)
//   ]);

//   return (
//     <div className="p-4 md:p-6">
//       <h1 className="text-lg md:text-xl font-bold mb-4">Payment Report</h1>

//       {/* Controls - hide when printing */}
//       <div className="mb-6 print:hidden">
//         {/* Dropdowns - stack on mobile, side-by-side on desktop */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <DropDown
//             label="Class"
//             value={selectedClasses}
//             onChange={(e) => setSelectedClasses(e.target.value)}
//             options={classes.map(c => ({
//               value: c.id,
//               label: c.name
//             }))}
//             required
//           />

//           <DropDown
//             label="Payment Status"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             options={[
//               { value: "", label: "All Students" },
//               { value: "fully_paid", label: "Fully Paid" },
//               { value: "partial", label: "Partial Payment" },
//               { value: "not_paid", label: "Not Paid" }
//             ]}
//           />
//         </div>

//         {/* Buttons - stack on mobile */}
//         <div className="flex flex-col sm:flex-row gap-2">
//           <Button onClick={loadReport} className="w-full sm:w-auto">
//             Generate Report
//           </Button>
          
//           {students.length > 0 && (
//             <Button 
//               onClick={handlePrint} 
//               className="w-full sm:w-auto hidden sm:inline-block"
//             >
//               Print Report
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Results */}
//       {loading ? (
//         <Loader />
//       ) : students.length > 0 ? (
//         <div>
//           {/* Print header - only shows when printing */}
//           <div className="hidden print:block mb-4 text-center">
//             <h2 className="text-2xl font-bold">Payment Report</h2>
//             <p className="mt-2">
//               <strong>Class:</strong> {classes.find(c => c.id === parseInt(selectedClasses))?.name}
//             </p>
//             <p>
//               <strong>Filter:</strong> {
//                 filter 
//                   ? filter.replace("_", " ").charAt(0).toUpperCase() + filter.replace("_", " ").slice(1)
//                   : "All Students"
//               }
//             </p>
//             <p className="text-sm mt-1">
//               Generated: {new Date().toLocaleDateString('en-NG', { 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric' 
//               })}
//             </p>
//             <hr className="my-4" />
//           </div>

//           {/* Desktop Table - hidden on mobile */}
//           <div className="hidden md:block">
//             <Table
//               headers={["S/N", "Student Name", "Class", "Total Fee", "Amount Paid", "Status/Balance"]}
//               data={tableData}
//             />
//           </div>

//           {/* Mobile Card View - hidden on desktop */}
//           <div className="md:hidden space-y-4">
//             {students.map((student, index) => (
//               <div 
//                 key={student.id} 
//                 className="bg-white border rounded-lg p-4 shadow-sm"
//               >
//                 {/* Student Number & Name */}
//                 <div className="flex justify-between items-start mb-3">
//                   <div>
//                     <p className="text-xs text-gray-500">#{index + 1}</p>
//                     <h3 className="font-semibold text-base">{student.name}</h3>
//                     <p className="text-sm text-gray-600">{student.class}</p>
//                   </div>
                  
//                   {/* Status Badge */}
//                   <span className={`
//                     px-2 py-1 rounded text-xs font-medium
//                     ${student.payment_status === "Fully Paid" ? "bg-green-100 text-green-800" : ""}
//                     ${student.payment_status === "Partial" ? "bg-yellow-100 text-yellow-800" : ""}
//                     ${student.payment_status === "Not Paid" ? "bg-red-100 text-red-800" : ""}
//                   `}>
//                     {student.payment_status}
//                   </span>
//                 </div>

//                 {/* Payment Details */}
//                 <div className="grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <p className="text-gray-500 text-xs">Total Fee</p>
//                     <p className="font-medium">
//                       ₦{parseFloat(student.total_fee).toLocaleString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500 text-xs">Amount Paid</p>
//                     <p className="font-medium text-green-600">
//                       ₦{parseFloat(student.total_paid).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Balance/Status */}
//                 <div className="mt-3 pt-3 border-t">
//                   <p className="text-xs text-gray-500">Balance</p>
//                   <p className={`
//                     font-semibold
//                     ${student.payment_status === "Fully Paid" ? "text-green-600" : ""}
//                     ${student.payment_status === "Partial" ? "text-yellow-600" : ""}
//                     ${student.payment_status === "Not Paid" ? "text-red-600" : ""}
//                   `}>
//                     {formatAmountDisplay(student)}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Summary section - responsive */}
//           <div className="mt-6 p-4 bg-gray-100 rounded border">
//             <h3 className="font-bold text-base md:text-lg mb-3">Summary</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//               <div>
//                 <p className="text-xs md:text-sm text-gray-600">Total Students</p>
//                 <p className="text-lg md:text-xl font-semibold">{students.length}</p>
//               </div>
//               <div>
//                 <p className="text-xs md:text-sm text-gray-600">Total Fees</p>
//                 <p className="text-lg md:text-xl font-semibold">
//                   ₦{students
//                     .reduce((sum, s) => sum + parseFloat(s.total_fee || 0), 0)
//                     .toLocaleString()}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs md:text-sm text-gray-600">Total Collected</p>
//                 <p className="text-lg md:text-xl font-semibold text-green-600">
//                   ₦{students
//                     .reduce((sum, s) => sum + parseFloat(s.total_paid || 0), 0)
//                     .toLocaleString()}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-xs md:text-sm text-gray-600">Total Outstanding</p>
//                 <p className="text-lg md:text-xl font-semibold text-red-600">
//                   ₦{students
//                     .reduce((sum, s) => sum + parseFloat(s.balance || 0), 0)
//                     .toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-8 md:py-12 bg-gray-50 rounded border border-dashed">
//           <p className="text-sm md:text-base text-gray-500">
//             Select a class and click "Generate Report" to view payment data
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react'
import { getPaymentReport } from '../api/students.api'
import { getClasses } from "../api/classes.api";
import DropDown from "../components/common/DropDown"
import Loader from '../components/common/Loader'
import Button from '../components/common/Button';

export default function PaymentReportPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState("")
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [students, setStudents] = useState([])

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data)
      } catch (err) {
        console.error("failed to load classes", err)
      }
    };
    loadClasses();
  }, [])

  const loadReport = async () => {
    if (!selectedClasses) {
      alert("Please select a class");
      return;
    }
    
    setLoading(true);
    try {
      const data = await getPaymentReport({
        classId: selectedClasses,
        paymentStatus: filter
      })
      setStudents(data);
    } catch (err) {
      console.error("Error fetching report:", err);
      alert("Failed to load report. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print();
  }

  const formatAmountDisplay = (student) => {
    if (student.payment_status === "Fully Paid") {
      return "Fully Paid";
    } else if (student.payment_status === "Not Paid") {
      return "Not Paid";
    } else {
      return `₦${parseFloat(student.balance).toLocaleString()} left`;
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-6">
        
        {/* Page Title - HIDE WHEN PRINTING */}
        <h1 className="text-lg md:text-xl font-bold mb-4 print:hidden">
          Payment Report
        </h1>

        {/* Controls - HIDE WHEN PRINTING */}
        <div className="mb-6 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <DropDown
              label="Class"
              value={selectedClasses}
              onChange={(e) => setSelectedClasses(e.target.value)}
              options={classes.map(c => ({
                value: c.id,
                label: c.name
              }))}
              required
            />

            <DropDown
              label="Payment Status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: "", label: "All Students" },
                { value: "fully_paid", label: "Fully Paid" },
                { value: "partial", label: "Partial Payment" },
                { value: "not_paid", label: "Not Paid" }
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={loadReport} className="w-full sm:w-auto">
              Generate Report
            </Button>
            
            {students.length > 0 && (
              <Button 
                onClick={handlePrint} 
                className="w-full sm:w-auto hidden sm:inline-block"
              >
                Print Report
              </Button>
            )}
          </div>
        </div>

        {/* RESULTS SECTION */}
        {loading ? (
          <Loader />
        ) : students.length > 0 ? (
          <div>
            
         
            <div className="hidden print:block text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Payment Report</h2>
              <p className="mb-1">
                <strong>Class:</strong> {classes.find(c => c.id === parseInt(selectedClasses))?.name}
              </p>
              <p className="mb-1">
                <strong>Filter:</strong> {
                  filter 
                    ? filter.replace("_", " ").charAt(0).toUpperCase() + filter.replace("_", " ").slice(1)
                    : "All Students"
                }
              </p>
              <p className="text-sm mb-4">
                Generated: {new Date().toLocaleDateString('en-NG', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <hr className="border-black border-t-2" />
            </div>

          
            <div className="hidden md:block print:block">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 print:bg-white">
                    <th className="border border-gray-300 p-2 text-left print:border-black">S/N</th>
                    <th className="border border-gray-300 p-2 text-left print:border-black">Student Name</th>
                    <th className="border border-gray-300 p-2 text-left print:border-black">Class</th>
                    <th className="border border-gray-300 p-2 text-left print:border-black">Total Fee</th>
                    <th className="border border-gray-300 p-2 text-left print:border-black">Amount Paid</th>
                    <th className="border border-gray-300 p-2 text-left print:border-black">Status/Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id}>
                      <td className="border border-gray-300 p-2 print:border-black">{index + 1}</td>
                      <td className="border border-gray-300 p-2 print:border-black">{student.name}</td>
                      <td className="border border-gray-300 p-2 print:border-black">{student.class}</td>
                      <td className="border border-gray-300 p-2 print:border-black">
                        ₦{parseFloat(student.total_fee).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 p-2 print:border-black">
                        ₦{parseFloat(student.total_paid).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 p-2 print:border-black">
                        {formatAmountDisplay(student)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden print:hidden space-y-4">
              {students.map((student, index) => (
                <div 
                  key={student.id} 
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-500">#{index + 1}</p>
                      <h3 className="font-semibold text-base">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.class}</p>
                    </div>
                    
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${student.payment_status === "Fully Paid" ? "bg-green-100 text-green-800" : ""}
                      ${student.payment_status === "Partial" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${student.payment_status === "Not Paid" ? "bg-red-100 text-red-800" : ""}
                    `}>
                      {student.payment_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Total Fee</p>
                      <p className="font-medium">
                        ₦{parseFloat(student.total_fee).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Amount Paid</p>
                      <p className="font-medium text-green-600">
                        ₦{parseFloat(student.total_paid).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500">Balance</p>
                    <p className={`
                      font-semibold
                      ${student.payment_status === "Fully Paid" ? "text-green-600" : ""}
                      ${student.payment_status === "Partial" ? "text-yellow-600" : ""}
                      ${student.payment_status === "Not Paid" ? "text-red-600" : ""}
                    `}>
                      {formatAmountDisplay(student)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

           
            <div className="mt-6 p-4 bg-gray-100 rounded border print:bg-white print:mt-6">
              <h3 className="font-bold text-base md:text-lg mb-3">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Students</p>
                  <p className="text-lg md:text-xl font-semibold">{students.length}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Fees</p>
                  <p className="text-lg md:text-xl font-semibold">
                    ₦{students
                      .reduce((sum, s) => sum + parseFloat(s.total_fee || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Collected</p>
                  <p className="text-lg md:text-xl font-semibold text-green-600">
                    ₦{students
                      .reduce((sum, s) => sum + parseFloat(s.total_paid || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total Outstanding</p>
                  <p className="text-lg md:text-xl font-semibold text-red-600">
                    ₦{students
                      .reduce((sum, s) => sum + parseFloat(s.balance || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-8 md:py-12 bg-gray-50 rounded border border-dashed print:hidden">
            <p className="text-sm md:text-base text-gray-500">
              Select a class and click "Generate Report" to view payment data
            </p>
          </div>
        )}
      </div>

 
      <style jsx>{`
        @media print {
          /* Force table to show when printing */
          .print\\:block {
            display: block !important;
          }
          
          /* Hide mobile cards when printing */
          .print\\:hidden {
            display: none !important;
          }
          
          /* Remove all height restrictions */
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
          
          /* Allow content to flow across pages */
          table {
            page-break-inside: auto;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          /* Repeat table header on each page */
          thead {
            display: table-header-group;
          }
          
          /* Page setup */
          @page {
            size: A4 portrait;
            margin: 1.5cm;
          }
        }
      `}</style>
    </div>
  )
}