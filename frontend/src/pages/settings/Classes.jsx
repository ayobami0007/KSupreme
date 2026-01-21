
// import { useState, useEffect } from "react";
// import { getClasses, createClass } from "../../api/classes.api";

// export default function ClassManagement({ activeSession = "2024/2025" }) {
//   const [className, setClassName] = useState("");
//   const [section, setSection] = useState("");
//   const [level, setLevel] = useState("");
//   const [track, setTrack] = useState("");
//   const [error, setError] = useState("");
//   const [classes, setClasses] = useState([]);

//   useEffect(() => {
//     const loadClasses = async () => {
//       try {
//         const data = await getClasses();
//         setClasses(data);
//       } catch (err) {
//         console.error("Failed to load classes:", err);
//       }
//     };
//     loadClasses();
//   }, []);

//   const handleSubmit = async () => {
//     if (!className.trim()) {
//       setError("Class name is required");
//       return;
//     }
//     if (!section) {
//       setError("Section is required");
//       return;
//     }
//     if (section === "Secondary" && !level) {
//       setError("Level is required for Secondary");
//       return;
//     }
//     if (section === "Secondary" && !track) {
//       setError("Track is required for Secondary");
//       return;
//     }

//     try {
//       await createClass({
//         name: className,
//         section,
//         level,
//         track,
//         session: activeSession,
//       });
//       const updated = await getClasses();
//       setClasses(updated);

//       setClassName("");
//       setSection("");
//       setLevel("");
//       setTrack("");
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl sm:text-3xl font-bold mb-6">Class Management</h1>

//       {/* Add Class Form */}
//       <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
//         <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Class</h2>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Class Name</label>
//             <input
//               type="text"
//               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={className}
//               onChange={(e) => setClassName(e.target.value)}
//               placeholder="Enter class name"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Section</label>
//             <select
//               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={section}
//               onChange={(e) => setSection(e.target.value)}
//               required
//             >
//               <option value="">Select Section</option>
//               <option value="Primary">Primary</option>
//               <option value="Secondary">Secondary</option>
//             </select>
//           </div>

//           {section === "Secondary" && (
//             <>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Level</label>
//                 <select
//                   className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   value={level}
//                   onChange={(e) => setLevel(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Level</option>
//                   <option>Basic</option>
//                   <option>Intermediate</option>
//                   <option>Advanced</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Track</label>
//                 <select
//                   className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                   value={track}
//                   onChange={(e) => setTrack(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Track</option>
//                   <option>Science</option>
//                   <option>Arts</option>
//                   <option>Commercial</option>
//                 </select>
//               </div>
//             </>
//           )}

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <p className="text-sm text-gray-600">
//             Current active session:{" "}
//             <span className="font-semibold">{activeSession}</span>
//           </p>

//           <button
//             className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             onClick={handleSubmit}
//           >
//             Add Class
//           </button>
//         </div>
//       </div>

//       {/* Classes Table */}
//       <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
//         <h2 className="text-lg sm:text-xl font-semibold mb-4">Classes List</h2>
//         <table className="min-w-full table-auto border text-sm sm:text-base">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2 border">Class Name</th>
//               <th className="p-2 border">Section</th>
//               <th className="p-2 border">Level</th>
//               {/* <th className="p-2 border">Track</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {classes.length === 0 ? (
//               <tr>
//                 <td colSpan="4" className="p-4 text-center text-gray-500">
//                   No classes added yet
//                 </td>
//               </tr>
//             ) : (
//               classes.map((c, idx) => (
//                 <tr key={idx} className="border-t">
//                   <td className="p-2 border">{c.name}  {c.track && (
//                     <span className="text-gray-500 italic"> - {c.track}</span>
//                   )}</td>
//                   <td className="p-2 border">{c.section}</td>
//                   <td className="p-2 border">{c.level}</td>
//                   {/* <td className="p-2 border">{c.track}</td> */}
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
import { getClasses, createClass } from "../../api/classes.api";

export default function ClassManagement({ activeSession = "2024/2025" }) {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [level, setLevel] = useState("");
  const [track, setTrack] = useState("");
  const [error, setError] = useState("");
  const [classes, setClasses] = useState([]);

  // Filter state
  const [filterSection, setFilterSection] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };
    loadClasses();
  }, []);

  const handleSubmit = async () => {
    if (!className.trim()) {
      setError("Class name is required");
      return;
    }
    if (!section) {
      setError("Section is required");
      return;
    }
    if (section === "Secondary" && !level) {
      setError("Level is required for Secondary");
      return;
    }
    if (section === "Secondary" && !track) {
      setError("Track is required for Secondary");
      return;
    }

    try {
      await createClass({
        name: className,
        section,
        level,
        track,
        session: activeSession,
      });
      const updated = await getClasses();
      setClasses(updated);

      setClassName("");
      setSection("");
      setLevel("");
      setTrack("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  // Apply filter
  const filteredClasses = classes.filter((c) => {
    return filterSection ? c.section === filterSection : true;
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Class Management</h1>

      {/* Add Class Form */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Class</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Class Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Enter class name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Section</label>
            <select
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            >
              <option value="">Select Section</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
            </select>
          </div>

          {section === "Secondary" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <select
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                >
                  <option value="">Select Level</option>
                  <option>Basic</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Track</label>
                <select
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  required
                >
                  <option value="">Select Track</option>
                  <option>Science</option>
                  <option>Arts</option>
                  <option>Commercial</option>
                </select>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <p className="text-sm text-gray-600">
            Current active session:{" "}
            <span className="font-semibold">{activeSession}</span>
          </p>

          <button
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Add Class
          </button>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Classes List</h2>

        {/* Section Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Filter by Section</label>
          <select
            className="border rounded px-3 py-2"
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
          >
            <option value="">All Sections</option>
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
          </select>
        </div>

        <table className="min-w-full table-auto border text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Class Name</th>
              <th className="p-2 border">Section</th>
              <th className="p-2 border">Level</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No classes found
                </td>
              </tr>
            ) : (
              filteredClasses.map((c, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 border">
                    {c.name}{" "}
                    {c.track && (
                      <span className="text-gray-500 italic"> - {c.track}</span>
                    )}
                  </td>
                  <td className="p-2 border">{c.section}</td>
                  <td className="p-2 border">{c.level}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
