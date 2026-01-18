
// import { useState, useEffect } from "react";
// import { createSession, getSessions, activateSession } from "../../api/sessions.api";

// export default function SessionsPage() {
//   const [sessionName, setSessionName] = useState("");
//   const [isActive, setIsActive] = useState(false);
//   const [error, setError] = useState("");
//   const [sessions, setSessions] = useState([]);

//   useEffect(() => {
//     loadSessions();
//   }, []);

//   const loadSessions = async () => {
//     try {
//       const data = await getSessions(); // Axios call
//       setSessions(data);
//     } catch (err) {
//       console.error("Failed to load sessions:", err);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!sessionName.trim()) {
//       setError("Session name is required");
//       return;
//     }
//     try {
//       const res = await createSession({ name: sessionName }); // Axios call
//       if (isActive) {
//         await activateSession(res.id); // Axios call
//       }
//       await loadSessions(); // refresh list
//       setSessionName("");
//       setIsActive(false);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     }
//   };

//   const handleActivate = async (id) => {
//     try {
//       await activateSession(id); // Axios call
//       await loadSessions();
//     } catch (err) {
//       console.error("Failed to activate session:", err);
//     }
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Session Management</h1>

//       {/* Create Session Form */}
//       <div className="bg-white rounded shadow p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Add New Session</h2>
//         <input
//           type="text"
//           className="w-full border rounded p-2 mb-2"
//           value={sessionName}
//           onChange={(e) => setSessionName(e.target.value)}
//           placeholder="Enter session name (e.g. 2025/2026)"
//         />
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//         <label className="flex items-center gap-2 mb-4 text-sm font-medium">
//           <input
//             type="checkbox"
//             checked={isActive}
//             onChange={(e) => setIsActive(e.target.checked)}
//           />
//           Mark as active session
//         </label>

//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           onClick={handleSubmit}
//         >
//           Create Session
//         </button>
//       </div>

//       {/* Sessions List */}
//       <div className="bg-white rounded shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Existing Sessions</h2>
//         <ul>
//           {sessions.map((s) => (
//             <li key={s.id} className="flex justify-between items-center mb-2">
//               <span>
//                 {s.name} {s.is_active ? "(Active)" : ""}
//               </span>
//               {!s.is_active && (
//                 <button
//                   className="px-3 py-1 bg-green-600 text-white rounded"
//                   onClick={() => handleActivate(s.id)}
//                 >
//                   Activate
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { createSession, getSessions, activateSession } from "../../api/sessions.api";

export default function SessionsPage() {
  const [sessionName, setSessionName] = useState("");
  const [isActive, setIsActive] = useState(false);
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
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="Enter session name (e.g. 2025/2026)"
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

        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition
          cursor-pointer"
          onClick={handleSubmit}
        >
          Create Session
        </button>
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
              {/* {!s.is_active && (
                <button
                  className="mt-2 sm:mt-0 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm sm:text-base"
                  onClick={() => handleActivate(s.id)}
                >
                  Activate
                </button>
              )} */}
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
