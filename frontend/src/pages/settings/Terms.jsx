
import { useState, useEffect } from "react";
import { getSessions } from "../../api/sessions.api";
import { getTerms, createTerm, activateTerm } from "../../api/terms.api";

export default function TermsPage() {
  const [termName, setTermName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [filterSessionId, setFilterSessionId] = useState("")

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
    try {
      const res = await createTerm({
        name: termName,
        session_id: Number(sessionId),
        is_active: isActive ? 1 : 0,
      });
      if (isActive) {
        await activateTerm(res.id );
      }
      await loadTerms();
      setTermName("");
      setSessionId("");
      setIsActive(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
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

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Term Management</h1>

      {/* Create Term Form */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Term</h2>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={termName}
          onChange={(e) => setTermName(e.target.value)}
          placeholder="Enter term name (e.g. First Term)"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="block mb-2 text-sm font-medium">Session</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        >
          <option value="">Select Session</option>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 mb-4 text-sm sm:text-base font-medium">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Mark as active term
        </label>

        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Create Term
        </button>
      </div>

      {/* session select */}
      <label className="block mb-2 text-sm font-medium">Filter by Session</label>
      <select name=""
        className="w-full sm:w-64 border rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={filterSessionId}
        onChange={(e) => setFilterSessionId(e.target.value)}
      >
        <option value="">All Sessions</option>
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} {s.is_active ? "(Active)" : ""}
          </option>
        ))}

      </select>

      {/* Terms Table */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Existing Terms</h2>
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {terms
            .filter((t) => !filterSessionId || t.session_id === Number(filterSessionId))
            .map((t) => (
              <tr key={t.id}>
                <td className="border p-2">{t.id}</td>
                <td className="border p-2">
                  {t.name} – {t.session_name}
                </td>
                <td className="border p-2">
                  {t.is_active ? "Active" : "Inactive"}
                </td>
                <td className="border p-2">
                  {!t.is_active && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      onClick={() => handleActivate(t.id)}
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
