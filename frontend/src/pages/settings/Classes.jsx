
import { useState, useEffect } from "react";

import { getClasses, createClass } from "../../api/classes.api";

export default function ClassManagement({ activeSession = "2024/2025" }) {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [level, setLevel] = useState("");
  const [track, setTrack] = useState("");
  const [error, setError] = useState("");
  const [classes, setClasses] = useState([]);

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


  // later replace with API call
  // const handleSubmit = () => {
  //   if (!className.trim()) {
  //     setError("Class name is required");
  //     return;
  //   }
  //   if (!section) {
  //     setError("Section is required");
  //     return;
  //   }
  //   if (section === "Secondary" && !level) {
  //     setError("Level is required for Secondary");
  //     return;
  //   }
  //   if (section === "Secondary" && !track) {
  //     setError("Track is required for Secondary");
  //     return;
  //   }

  //   const newClass = { className, section, level, track, session: activeSession };
  //   setClasses([...classes, newClass]); // temporary local add
  //   setClassName("");
  //   setSection("");
  //   setLevel("");
  //   setTrack("");
  //   setError("");
  // };

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
      session: activeSession, // optional if you store session
    });
    // refresh list
    const updated = await getClasses();
    setClasses(updated);

    // reset form
    setClassName("");
    setSection("");
    setLevel("");
    setTrack("");
    setError("");
  } catch (err) {
    setError(err.response?.data?.error || err.message);
  }
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Class Management</h1>

      {/* Add Class Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Class</h2>

        <label className="block mb-2 text-sm font-medium">Class Name</label>
        <input
          type="text"
          className="w-full border rounded p-2 mb-2"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="Enter class name"
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="block mb-2 text-sm font-medium">Section</label>
        <select
          className="w-full border rounded p-2 mb-3"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          required
        >
          <option value="">Select Section</option>
          <option value="Primary">Primary</option>
          <option value="Secondary">Secondary</option>
        </select>

        {section === "Secondary" && (
          <>
            <label className="block mb-2 text-sm font-medium">Level</label>
            <select
              className="w-full border rounded p-2 mb-3"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="">Select Level</option>
              <option>Basic</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <label className="block mb-2 text-sm font-medium">Track</label>
            <select
              className="w-full border rounded p-2 mb-3"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              required
            >
              <option value="">Select Track</option>
              <option>Science</option>
              <option>Arts</option>
              <option>Commercial</option>
            </select>
          </>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Current active session: <span className="font-semibold">{activeSession}</span>
        </p>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Add Class
        </button>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Classes List</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Class Name</th>
              <th className="p-2 border">Section</th>
              <th className="p-2 border">Level</th>
              <th className="p-2 border">Track</th>
              {/* <th className="p-2 border">Session</th> */}
            </tr>
          </thead>
          <tbody>
            {classes.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No classes added yet
                </td>
              </tr>
            ) : (
              classes.map((c, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 border">{c.name}</td>
                  <td className="p-2 border">{c.section}</td>
                  <td className="p-2 border">{c.level}</td>
                  <td className="p-2 border">{c.track}</td>
                  {/* <td className="p-2 border">{c.session}</td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
