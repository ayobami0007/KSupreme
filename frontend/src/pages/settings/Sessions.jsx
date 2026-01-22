
import { useState, useEffect } from "react";
import { createSession, getSessions, activateSession } from "../../api/sessions.api";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function SessionsPage() {
  const [sessionName, setSessionName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  const handleSubmit = async () => {
    if (!sessionName.trim()) {
      setError("Session name is required");
      
      return;
    }
    setLoading(true)
    try {
      const res = await createSession({ name: sessionName });
      if (isActive) {
        await activateSession(res.id);
      }
      await loadSessions();
      setSessionName("");
      setIsActive(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false)
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateSession(id);
      await loadSessions();
    } catch (err) {
      console.error("Failed to activate session:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Session Management</h1>

      {/* Create Session Form */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Session</h2>


        <Input
          label="session Name"
          value={sessionName}
          type="text"
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="Enter session name (e.g. 2025/2026)"
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="flex items-center gap-2 mb-4 text-sm sm:text-base font-medium">
          <input
            type="checkbox"
            checked={isActive}

            onChange={(e) => setIsActive(e.target.checked)}
          />
          Mark as active session
        </label>

        <Button

          onClick={handleSubmit}
          loading={loading}
        >
          Add session
        </Button>

      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Existing Sessions</h2>
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2"
            >
              <span className="text-sm sm:text-base">
                {s.name} {s.is_active ? "(Active)" : ""}
              </span>

              {!s.is_active && (
                <button
                  className="mt-2 sm:mt-0 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm sm:text-base 
    cursor-pointer"
                  onClick={() => {
                    const confirmed = window.confirm(
                      `Are you sure you want to activate session ${s.name}? This will affect current term and payment records.`
                    );
                    if (confirmed) {
                      handleActivate(s.id);
                    }
                  }}
                >
                  Activate
                </button>
              )}

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
