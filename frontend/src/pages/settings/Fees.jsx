

// import { useState, useEffect } from "react";
// import { getClasses } from "../../api/classes.api";
// import { getTerms } from "../../api/terms.api";
// import { getFees, setSchoolFee } from "../../api/schoolFees.api";

// export default function FeesPage() {
//   const [classes, setClasses] = useState([]);
//   const [terms, setTerms] = useState([]);
//   const [fees, setFees] = useState([]);

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedTerm, setSelectedTerm] = useState("");
//   const [filterClass, setFilterClass] = useState("");
// const [filterTerm, setFilterTerm] = useState("");

//   const [amount, setAmount] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const classData = await getClasses();
//         setClasses(classData);

//         const termData = await getTerms();
//         setTerms(termData);

//         const feeData = await getFees();
//         setFees(feeData);
//       } catch (err) {
//         console.error("Failed to load data:", err);
//       }
//     };
//     loadData();
//   }, []);

//   const handleSubmit = async () => {
//     if (!selectedClass) return setError("Class is required");
//     if (!selectedTerm) return setError("Term is required");
//     if (!amount) return setError("Amount is required");

//     try {
//       await setSchoolFee({
//         class_id: Number(selectedClass),
//         term_id: Number(selectedTerm),
//         amount: Number(amount),
//       });
//       const updatedFees = await getFees();
//       setFees(updatedFees);

//       setSelectedClass("");
//       setSelectedTerm("");
//       setAmount("");
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl sm:text-3xl font-bold mb-6">
//         School Fees Management
//       </h1>

//       {/* Fee Setup Form */}
//       <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
//         <h2 className="text-lg sm:text-xl font-semibold mb-4">Set School Fee</h2>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Class</label>
//             <select
//               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={selectedClass}
//               onChange={(e) => {
//                 setSelectedClass(e.target.value);
//                 setError("");
//               }}
//               required
//             >
//               <option value="">Select Class</option>
//               {classes.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name} {c.track && (
//   <span className="text-gray-500 italic"> - {c.track}</span>
// )}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Term</label>
//             <select
//               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={selectedTerm}
//               onChange={(e) => {
//                 setSelectedTerm(e.target.value);
//                 setError("");
//               }}
//               required
//             >
//               <option value="">Select Term</option>
//               {terms.map((t) => (
//                 <option key={t.id} value={t.id}>
//                   {t.name} - {t.session_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Amount</label>
//             <input
//               type="number"
//               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={amount}
//               onChange={(e) => {
//                 setAmount(e.target.value);
//                 setError("");
//               }}
//               placeholder="Enter amount"
//               required
//             />
//           </div>

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <button
//             className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             onClick={handleSubmit}
//           >
//             Save Fee
//           </button>
//         </div>
//       </div>
// <div className="flex gap-4 mb-4">
//   <div>
//     <label className="block text-sm font-medium mb-1">Filter by Class</label>
//     <select
//       className="border rounded px-3 py-2"
//       value={filterClass}
//       onChange={(e) => setFilterClass(e.target.value)}
//     >
//       <option value="">All Classes</option>
//       {classes.map((c) => (
//         <option key={c.id} value={c.name}>
//           {c.name} {c.track}
//         </option>
//       ))}
//     </select>
//   </div>

//   <div>
//     <label className="block text-sm font-medium mb-1">Filter by Term</label>
//     <select
//       className="border rounded px-3 py-2"
//       value={filterTerm}
//       onChange={(e) => setFilterTerm(e.target.value)}
//     >
//       <option value="">All Terms</option>
//       {terms.map((t) => (
//         <option key={t.id} value={t.name}>
//           {t.name} - {t.session_name}
//         </option>
//       ))}
//     </select>
//   </div>
// </div>

//       {/* Fees Table */}
//       <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
//         <h2 className="text-lg sm:text-xl font-semibold mb-4">Fees List</h2>
//         <table className="min-w-full table-auto border text-sm sm:text-base">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2 border">Class</th>
//               <th className="p-2 border">Term</th>
//               <th className="p-2 border">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {fees.length === 0 ? (
//               <tr>
//                 <td colSpan="3" className="p-4 text-center text-gray-500">
//                   No fees set yet
//                 </td>
//               </tr>
//             ) : (
//               fees.map((f) => (
//                 <tr key={f.id} className="border-t">
//                   <td className="p-2 border">{f.class_name}</td>
//                   <td className="p-2 border">{f.term_name}</td>
//                   <td className="p-2 border">{f.amount}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { getClasses } from "../../api/classes.api";
import { getTerms } from "../../api/terms.api";
import { getFees, setSchoolFee } from "../../api/schoolFees.api";

export default function FeesPage() {
  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [fees, setFees] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // Filter state
  const [filterClass, setFilterClass] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const classData = await getClasses();
        setClasses(classData);

        const termData = await getTerms();
        setTerms(termData);

        const feeData = await getFees();
        setFees(feeData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedClass) return setError("Class is required");
    if (!selectedTerm) return setError("Term is required");
    if (!amount) return setError("Amount is required");

    try {
      await setSchoolFee({
        class_id: Number(selectedClass),
        term_id: Number(selectedTerm),
        amount: Number(amount),
      });
      const updatedFees = await getFees();
      setFees(updatedFees);

      setSelectedClass("");
      setSelectedTerm("");
      setAmount("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Apply class filter
  const filteredFees = fees.filter((f) => {
    return filterClass ? f.class_name === filterClass : true;
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        School Fees Management
      </h1>

      {/* Fee Setup Form */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Set School Fee</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setError("");
              }}
              required
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.track && (
                    <span className="text-gray-500 italic"> - {c.track}</span>
                  )}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Term</label>
            <select
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedTerm}
              onChange={(e) => {
                setSelectedTerm(e.target.value);
                setError("");
              }}
              required
            >
              <option value="">Select Term</option>
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} - {t.session_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              placeholder="Enter amount"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Save Fee
          </button>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Fees List</h2>

        {/* Class Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Filter by Class</label>
          <select
            className="border rounded px-3 py-2"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} {c.track}
              </option>
            ))}
          </select>
        </div>

        <table className="min-w-full table-auto border text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Term</th>
              <th className="p-2 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No fees found
                </td>
              </tr>
            ) : (
              filteredFees.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="p-2 border">{f.class_name}</td>
                  <td className="p-2 border">{f.term_name}</td>
                  <td className="p-2 border">{f.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
