
import { useState, useEffect } from "react";
import SummaryCards from "../components/common/SummaryCards";
import PaymentsTable from "../components/common/PaymentsTable";
import { useTerm } from "../context/TermContext";
import { getDashboardSummary } from "../api/dashboard.api";

const Dashboard = () => {
  const { activeTerm, loading } = useTerm();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setStats([
          { label: "Total Students", value: data.total_students },
          { label: "Fully Paid Students", value: data.fully_paid },
          { label: "Owing Students", value: data.owing },
          { label: "Total Amount Collected", value: `₦${data.total_amount}` },
        ]);
      } catch (err) {
        console.error("Failed to load summary:", err);
      }
    };
    loadSummary();
  }, []);

  if (loading) return <p>Loading....</p>;
  if (!activeTerm) return <p>No active term found</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">School Financial Dashboard</h1>
      <p className="mb-4">
        <strong>Active Term:</strong> {activeTerm.session} – {activeTerm.term}
      </p>
      <SummaryCards stats={stats} />
      <PaymentsTable payments={[]} /> {/* Next: connect payments */}
    </div>
  );
};

export default Dashboard;
