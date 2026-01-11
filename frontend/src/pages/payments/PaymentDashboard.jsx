
import { useState } from "react";
import StudentInfoCard from "../../components/student/StudentInfoCard";
import FeeSummaryCards from "../../components/student/FeeSummaryCards";
import PaymentProgress from "../../components/student/PaymentProgress";
import PaymentHistoryTable from "../../components/student/PaymentHistoryTable";
import AddPaymentModal from "../../components/student/AddPaymentModal";

const StudentDashboard = () => {
  const student = {
    name: "Esther Akpan",
    id: "IDS 1001",
    class: "Primary 1",
    totalFee: 50000,
    totalPaid: 40000,
  };

  const [payments, setPayments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Compute totalPaid dynamically
  const totalPaid = student.totalPaid + payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const balance = student.totalFee - totalPaid;

  // Determine payment status
  let status = "";
  if (totalPaid === 0) status = "Not Paid";
  else if (totalPaid < student.totalFee) status = "Partially Paid";
  else status = "Fully Paid";

  const handleAddPayment = (newPayment) => {
    const paymentWithDate = {
      ...newPayment,
      date: new Date().toLocaleDateString(),
      enteredBy: "Admin1",
    };
    setPayments([...payments, paymentWithDate]);
    setShowAddModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Student Payment Dashboard</h1>

      <StudentInfoCard student={{ ...student, totalPaid, balance, status }} />
      <FeeSummaryCards student={{ ...student, totalPaid, balance, status }} />
      <PaymentProgress totalPaid={totalPaid} totalFee={student.totalFee} />

      <PaymentHistoryTable
  payments={payments}
  onAddPayment={() => {
    if (status === "Fully Paid") {
      alert("Payment completed. No balance remaining.");
    } else {
      setShowAddModal(true);
    }
  }}
/>


      <AddPaymentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddPayment}
        balance={balance}
      />
    </div>
  );
};

export default StudentDashboard;
