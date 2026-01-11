
import { useState, useEffect } from "react";
import { getStudents, addStudent, updateStudent } from "../../api/students.api";
import { getClasses } from "../../api/classes.api";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");

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
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Student Management</h1>

      {/* Add Student Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Student</h2>

        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          type="text"
          className="w-full border rounded p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student name"
        />

        <label className="block mb-2 text-sm font-medium">Class</label>
        <select
          className="w-full border rounded p-2 mb-3"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm font-medium">Status</label>
        <select
          className="w-full border rounded p-2 mb-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Add Student
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Students List</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Section</th>
              <th className="p-2 border">Level</th>
              <th className="p-2 border">Track</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No students added yet
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2 border">{s.name}</td>
                  <td className="p-2 border">{s.class_name}</td>
                  <td className="p-2 border">{s.section}</td>
                  <td className="p-2 border">{s.level}</td>
                  <td className="p-2 border">{s.track}</td>
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
