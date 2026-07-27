import { useState, useEffect, } from "react";
import SummaryCards from "../components/dashboard/SummaryCards";
import PaymentsTable from "../components/dashboard/PaymentsTable";
import PaymentDonutChart from "../components/dashboard/PaymentDonutChart";
import { useTerm } from "../context/TermContext";
import { getDashboardSummary, getRecentPayments, getSectionDashboardSummary } from "../api/dashboard.api";
import Loader from "../components/common/Loader";
// import FullPageLoader from "../components/common/fullPageLoader";
const Dashboard = () => {
  const { activeTerm, loading } = useTerm();
  const [stats, setStats] = useState([]);
  const [sectionStats, setSectionStats] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getDashboardSummary();
        setStats([
          { label: "Total Students", value: data.total_students },
          { label: "Fully Paid Students", value: data.fully_paid },
          { label: "Owing Students", value: data.owing },
          { label: "Total Amount Collected", value: `₦${Number(data.total_amount).toLocaleString()}` },
          { label: "Total fee for term", value: `₦${Number(data.total_expected_fee).toLocaleString()}` },
        ]);

        const primaryData = await getSectionDashboardSummary("Primary")
        const secondaryData = await getSectionDashboardSummary("Secondary")


        setSectionStats({
          primary: [
            { label: "Total Students", value: primaryData.total_students },
            { label: "Fully Paid Students", value: primaryData.fully_paid },
            { label: "Owing Students", value: primaryData.owing },
            { label: "Total Amount Collected", value: `₦${Number(primaryData.total_amount).toLocaleString()}` },
            { label: "Total fee for term", value: `₦${Number(primaryData.total_expected_fee).toLocaleString()}` },
          ],
          secondary: [
            { label: "Total Students", value: secondaryData.total_students },
            { label: "Fully Paid Students", value: secondaryData.fully_paid },
            { label: "Owing Students", value: secondaryData.owing },
            { label: "Total Amount Collected", value: `₦${Number(secondaryData.total_amount).toLocaleString()}` },
            { label: "Total fee for term", value: `₦${Number(secondaryData.total_expected_fee).toLocaleString()}` },
          ],
        });


        const recent = await getRecentPayments();
        setPayments(recent.map(p => ({
          name: p.name,
          class: p.class,
          amount: `₦${Number(p.amount).toLocaleString()}`,

          mode: p.mode,
          date: new Date(p.date).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric"
          }),
          status: p.status

        }

        )

        ))
      } catch (err) {
        console.error("Failed to load dashbaord data:", err);
      }
    };
    loadData();
  }, []);

  if (loading) return <Loader />;
  if (!activeTerm) return <p>No active term found</p>;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen"> {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2"> School Financial Dashboard </h1>
      <p className="mb-4 text-sm sm:text-base"> <strong>Active Term:</strong> {activeTerm.session} – {activeTerm.term}
      </p> {/* Summary cards: grid responsive */}
      <h2 className="text-xl sm:text-2xl font-semibold mb-2">Overall Dashboard</h2>
      <SummaryCards stats={stats} />

      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Primary Section</h2>
        <SummaryCards stats={sectionStats.primary || []} />
      </div>

      {/* Secondary Section */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Secondary Section</h2>
        <SummaryCards stats={sectionStats.secondary || []} />
      </div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <PaymentDonutChart
    title="Overall"
    fullyPaid={stats.find(s => s.label === "Fully Paid Students")?.value || 0}
    owing={stats.find(s => s.label === "Owing Students")?.value || 0}
  />
  <PaymentDonutChart
    title="Primary Section"
    fullyPaid={sectionStats.primary?.find(s => s.label === "Fully Paid Students")?.value || 0}
    owing={sectionStats.primary?.find(s => s.label === "Owing Students")?.value || 0}
  />
  <PaymentDonutChart
    title="Secondary Section"
    fullyPaid={sectionStats.secondary?.find(s => s.label === "Fully Paid Students")?.value || 0}
    owing={sectionStats.secondary?.find(s => s.label === "Owing Students")?.value || 0}
  />
</div>

      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <PaymentsTable payments={payments} /> </div>
    </div>
  );
};

export default Dashboard;
