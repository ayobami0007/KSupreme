
import { useState, useEffect } from "react";
import { getStudents, addStudent } from "../../api/students.api";
import { getClasses } from "../../api/classes.api";

// Reusable components
import Input from "../../components/common/Input";
import Dropdown from "../../components/common/DropDown";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  // Form states
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
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
      alert("Student added successfully");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filter
  const filteredStudents = students.filter((s) => {
    return filterClass ? s.class_name === filterClass : true;
  });

  const sortedStudents = [...filteredStudents].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const recentStudents = sortedStudents.slice(-20);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Student Management</h1>

      {/* Add Student Form */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Student</h2>

        <div className="space-y-4">
          <Input
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
            required
          />

          <Dropdown
            label="Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={classes.map((c) => ({
              value: c.id,
              label: c.track ? `${c.name} - ${c.track}` : c.name,
            }))}
            required
          />

          <Dropdown
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button onClick={handleSubmit} loading={loading}>
            Add Student
          </Button>
        </div>
      </div>

      {/* Students Table with Class Filter */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Students List</h2>

        <Dropdown
          label="Filter by Class"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          options={[
            { value: "", label: "All Classes" },
            ...classes.map((c) => ({
              value: c.name,
              label: c.track ? `${c.name} - ${c.track}` : c.name,
            })),
          ]}
          className="w-48 mb-4"
        />

        <Table
          headers={["Name", "Class", "Level", "Status"]}
          data={recentStudents.map((s) => [
            s.name,
            s.track ? `${s.class_name} - ${s.track}` : s.class_name,
            s.level,
            s.status,
          ])}
        />
      </div>
    </div>
  );
}
