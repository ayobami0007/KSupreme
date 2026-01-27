
import { useState, useEffect } from "react";
import { getClasses, createClass } from "../../api/classes.api";

// Reusable components
import Input from "../../components/common/Input";
import Dropdown from "../../components/common/DropDown";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import BackArrow from "../../components/common/BackArrow";

export default function ClassManagement({ activeSession = "2024/2025" }) {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [level, setLevel] = useState("");
  const [track, setTrack] = useState("");
  const [error, setError] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!className.trim()) return setError("Class name is required");
    if (!section) return setError("Section is required");
    if (section === "Secondary" && !level) return setError("Level is required for Secondary");
    if (section === "Secondary" && level === "Senior" && !track)
      return setError("Track is required for Senior Secondary");

    setLoading(true);
    try {
      await createClass({
        name: className,
        section,
        level: section === "Primary" ? null : level,
        track: section === "Primary" ? null : track,
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
    } finally {
      setLoading(false);
    }
  };

  // Apply filter
  const filteredClasses = classes.filter((c) => {
    return filterSection ? c.section === filterSection : true;
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <BackArrow/>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Class Management</h1>

      {/* Add Class Form */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Class</h2>

        <div className="space-y-4">
          <Input
            label="Class Name"
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
            required
          />

          <Dropdown
            label="Section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            options={[
              { value: "Primary", label: "Primary" },
              { value: "Secondary", label: "Secondary" },
            ]}
            required
          />

          {section === "Secondary" && (
            <>
              <Dropdown
                label="Level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                options={[
                  { value: "Junior", label: "Junior" },
                  { value: "Senior", label: "Senior" },
                ]}
                required
              />

              {level === "Senior" && (
                <Dropdown
                  label="Track"
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  options={[
                    { value: "Science", label: "Science" },
                    { value: "Arts", label: "Arts" },
                    { value: "Commercial", label: "Commercial" },
                  ]}
                  required
                />
              )}
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <p className="text-sm text-gray-600">
            Current active session: <span className="font-semibold">{activeSession}</span>
          </p>

          <Button onClick={handleSubmit} loading={loading}>
            Add Class
          </Button>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Classes List</h2>

        <Dropdown
          label="Filter by Section"
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
          options={[
            { value: "", label: "All Sections" },
            { value: "Primary", label: "Primary" },
            { value: "Secondary", label: "Secondary" },
          ]}
          className="w-48 mb-4"
        />

        <Table
          headers={["Class Name", "Section", "Level"]}
          data={filteredClasses.map((c) => [
            c.track ? `${c.name} - ${c.track}` : c.name,
            c.section,
            c.level,
          ])}
        />
      </div>
    </div>
  );
}
