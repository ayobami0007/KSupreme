import { useState, useEffect } from "react";
import { getStudents, addStudent, updateStudent } from "../../api/students.api";
import { getClasses } from "../../api/classes.api";

import Loader from "../../components/common/Loader";

import { PencilIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";


// Reusable components
import Input from "../../components/common/Input";
import Dropdown from "../../components/common/DropDown";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import BackArrow from "../../components/common/BackArrow";
import IconButton from "../../components/common/IconButton";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  // Form states
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Editing state
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingName, setEditingName] = useState("");


  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Page loading
  const [pageLoading, setPageLoading] = useState(false);

  // Filter state
  const [filterClass, setFilterClass] = useState("");
  const [filterStatus, setFilterStatus] = useState("Active")

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const loadData = async () => {
    try {
      setPageLoading(true);
      const studentData = await getStudents({ status: filterStatus || undefined });
      setStudents(studentData);

      const classData = await getClasses();
      setClasses(classData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setPageLoading(false);
    }
  };

  const startEditing = (student) => {
    setEditingStudentId(student.id);
    setEditingName(student.name);
  };

  const handleSave = async (id) => {
    try {
      setActionLoadingId(id);
      await updateStudent(id, { name: editingName });
      setEditingStudentId(null);
      setEditingName("");
      await loadData();
    } catch (err) {
      console.error("Failed to update student:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      setActionLoadingId(id);
      await updateStudent(id, { status: "Inactive" });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReactivate = async (id) => {
    try {
      setActionLoadingId(id);
      await updateStudent(id, { status: "Active" });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setActionLoadingId(null);
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
      <BackArrow />

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
        <div className="flex">
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


          <Dropdown
            label="filter by status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "", label: "All" },
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]} className="w-48 mb-4" />
        </div>
        {pageLoading ? (
          <Loader />
        ) : (
          <Table
            headers={["Name", "Class", "Level", "Status", "Actions"]}
            data={recentStudents.map((s) => [
              editingStudentId === s.id ? (
                <Input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
              ) : (
                s.name
              ),
              s.track ? `${s.class_name} - ${s.track}` : s.class_name,
              s.level,
              s.status,
              editingStudentId === s.id ? (
                <div className="flex space-x-2">
                  <IconButton
                    icon={CheckCircleIcon}
                    onClick={() => handleSave(s.id)}
                    color="blue"
                    disabled={actionLoadingId === s.id}
                    title="Save"
                  />
                  <IconButton
                    icon={XCircleIcon}
                    onClick={() => setEditingStudentId(null)}
                    color="gray"
                    disabled={actionLoadingId === s.id}
                    title="Cancel"
                  />
                </div>
              ) : (
                <div>
                  <IconButton
                    icon={PencilIcon}
                    onClick={() => startEditing(s)}
                    color="blue"
                    disabled={actionLoadingId === s.id}
                    title="Edit"
                  />
                  <IconButton
                    icon={s.status === "Active" ? XCircleIcon : CheckCircleIcon}
                    onClick={() =>
                      s.status === "Active"
                        ? handleDeactivate(s.id)
                        : handleReactivate(s.id)
                    }
                    color={s.status === "Active" ? "red" : "green"}
                    disabled={actionLoadingId === s.id}
                    title={s.status === "Active" ? "Deactivate" : "Activate"}
                  />

                </div>
              ),
            ])}
          />
        )}
      </div>
    </div>
  );
}
