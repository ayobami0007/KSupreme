
// import { useState, useEffect } from "react";
// import { getStudents, addStudent } from "../../api/students.api";
// import { getClasses } from "../../api/classes.api";

// export default function StudentsPage() {
//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]);

//   const [name, setName] = useState("");
//   const [selectedClass, setSelectedClass] = useState("");
//   const [status, setStatus] = useState("Active");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const studentData = await getStudents();
//       setStudents(studentData);

//       const classData = await getClasses();
//       setClasses(classData);
//     } catch (err) {
//       console.error("Failed to load data:", err);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!name) return setError("Name is required");
//     if (!selectedClass) return setError("Class is required");

//     try {
//       await addStudent({
//         name,
//         class_id: Number(selectedClass),
//         status,
//       });
//       await loadData();
//       setName("");
//       setSelectedClass("");
//       setStatus("Active");
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl sm:text-3xl font-bold mb-6">Student Management</h1>

//       {/* Add Student Form */}
//       <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
//         <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Student</h2>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Name</label>
//             <input
//               type="text"
//               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter student name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Class</label>
//             <select
//               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//             >
//               <option value="">Select Class</option>
//               {classes.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name} {c.track}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Status</label>
//             <select
//               className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//             >
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//             </select>
//           </div>

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <button
//             className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             onClick={handleSubmit}
//           >
//             Add Student
//           </button>
//         </div>
//       </div>

//       {/* Students Table */}
//       <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
//         <h2 className="text-lg sm:text-xl font-semibold mb-4">Students List</h2>
//         <table className="min-w-full table-auto border text-sm sm:text-base">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2 border">Name</th>
//               <th className="p-2 border">Class</th>
//               <th className="p-2 border">Section</th>
//               <th className="p-2 border">Level</th>
//               {/* <th className="p-2 border">Track</th> */}
//               <th className="p-2 border">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length === 0 ? (
//               <tr>
//                 <td colSpan="6" className="p-4 text-center text-gray-500">
//                   No students added yet
//                 </td>
//               </tr>
//             ) : (
//               students.map((s) => (
//                 <tr key={s.id} className="border-t">
//                   <td className="p-2 border">{s.name}</td>
//                   <td className="p-2 border">{s.class_name}  {s.track && (
//   <span className="text-gray-500 italic"> - {s.track}</span>
// )}</td>
//                   <td className="p-2 border">{s.section}</td>
//                   <td className="p-2 border">{s.level}</td>
//                   {/* <td className="p-2 border">{s.track}</td> */}
//                   <td className="p-2 border">{s.status}</td>
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
import { getStudents, addStudent } from "../../api/students.api";
import { getClasses } from "../../api/classes.api";
import Loader from "../../components/common/Loader";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  // Form states
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  // Filter state
  const [filterClass, setFilterClass] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const studentData = await getStudents();
      setStudents(studentData);

      const classData = await getClasses();
      setClasses(classData);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  const handleSubmit = async () => {
    if (!name) return setError("Name is required");
    if (!selectedClass) return setError("Class is required");
setLoading(true)
    try {
      await addStudent({
        name,
        class_id: Number(selectedClass),
        status,
      });
      await loadData();
      setName("");
      setSelectedClass("");
      setStatus("Active");
      setError("");
      alert("Student added successfully ");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }finally { 
      setLoading(false); 
    }
  };

  // Apply filter
  const filteredStudents = students.filter((s) => {
    return filterClass ? s.class_name === filterClass : true;
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Student Management</h1>

      {/* Add Student Form */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Student</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <select
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.track}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
            onClick={handleSubmit}
          disabled={loading} >
      {loading ? <Loader /> : "Add Student"}
           
          </button>
        </div>
      </div>

      {/* Students Table with Class Filter */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Students List</h2>

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

        {/* Table */}
        <table className="min-w-full table-auto border text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Level</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2 border">{s.name}</td>
                  <td className="p-2 border">
                    {s.class_name}{" "}
                    {s.track && <span className="text-gray-500 italic"> - {s.track}</span>}
                  </td>
                  <td className="p-2 border">{s.level}</td>
                  <td className="p-2 border">{s.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
