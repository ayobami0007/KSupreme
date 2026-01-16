
import { createContext, useContext, useState, useEffect } from "react";
import { getActiveSession } from "../api/sessions.api";
import { getActiveTerm } from "../api/terms.api";

const TermContext = createContext();

export const TermProvider = ({ children }) => {
  const [activeTerm, setActiveTerm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveTerm = async () => {
      try {
        // 1. Get active session
        const session = await getActiveSession();
        if (!session) {
          setActiveTerm(null);
          return;
        }

        // 2. Get active term for that session
        const term = await getActiveTerm(session.id);

        // 3. Store in context
        setActiveTerm({
          sessionId : session.id,
          session: session.name,
          termId : term?.id || null,
          term: term?.name || "No active term",
        });
      } catch (err) {
        console.error("Failed to fetch active term:", err);
        setActiveTerm(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTerm();
  }, []);

  return (
    <TermContext.Provider value={{ activeTerm, loading }}>
      {children}
    </TermContext.Provider>
  );
};

export const useTerm = () => {
  const context = useContext(TermContext);
  if (!context) {
    throw new Error("useTerm must be used within a TermProvider");
  }
  return context;
};
