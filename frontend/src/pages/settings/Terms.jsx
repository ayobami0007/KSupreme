import { useState, useEffect } from "react";
import { getSessions } from "../../api/sessions.api";
import { getTerms, createTerm, activateTerm } from "../../api/terms.api";

// Reusable components
import Input from "../../components/common/Input";
import Dropdown from "../../components/common/DropDown";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import BackArrow from "../../components/common/BackArrow";

export default function TermsPage() {
  const [termName, setTermName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [filterSessionId, setFilterSessionId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSessions();
    loadTerms();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  const loadTerms = async () => {
    try {
      const data = await getTerms();
      setTerms(data);
    } catch (err) {
      console.error("Failed to load terms:", err);
    }
  };

  const handleSubmit = async () => {
    if (!termName.trim() || !sessionId) {
      setError("Term name and session are required");
      return;
    }
    setLoading(true);
    try {
      const res = await createTerm({
        name: termName,
        session_id: Number(sessionId),
        is_active: isActive ? 1 : 0,
      });
      if (isActive) {
        await activateTerm(res.id);
      }
      await loadTerms();
      setTermName("");
      setSessionId("");
      setIsActive(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateTerm(id);
      await loadTerms();
    } catch (err) {
      console.error("Failed to activate term:", err);
    }
  };

  // Filter terms by session
  const filteredTerms = terms.filter(
    (t) => !filterSessionId || t.session_id === Number(filterSessionId)
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <BackArrow/>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Term Management</h1>

      {/* Create Term Form */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Term</h2>

        <Input
          label="Term Name"
          type="text"
          value={termName}
          onChange={(e) => setTermName(e.target.value)}
          placeholder="Enter term name (e.g. First Term)"
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <Dropdown
          label="Session"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          options={[
            { value: "", label: "Select Session" },
            ...sessions.map((s) => ({ value: s.id, label: s.name })),
          ]}
          required
        />

        {/*  marking active on creation */}
        {/* <label className="flex items-center gap-2 mb-4 text-sm sm:text-base font-medium">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Mark as active term
        </label> */}

        <Button onClick={handleSubmit} loading={loading}>
          Create Term
        </Button>
      </div>

      {/* Session Filter */}
      <Dropdown
        label="Filter by Session"
        value={filterSessionId}
        onChange={(e) => setFilterSessionId(e.target.value)}
        options={[
          { value: "", label: "All Sessions" },
          ...sessions.map((s) => ({
            value: s.id,
            label: s.is_active ? `${s.name} (Active)` : s.name,
          })),
        ]}
        className="w-64 mb-4"
      />

      {/* Terms Table */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Existing Terms</h2>

        <Table
          headers={["ID", "Name", "Status", "Action"]}
          data={filteredTerms.map((t) => [
            t.id,
            `${t.name} – ${t.session_name}`,
            t.is_active ? "Active" : "Inactive",
            !t.is_active ? (
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition cursor-pointer"
                onClick={() => handleActivate(t.id)}
              >
                Activate
              </button>
            ) : (
              ""
            ),
          ])}
        />
      </div>
    </div>
  );
}
