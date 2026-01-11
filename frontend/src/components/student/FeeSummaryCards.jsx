
import React from "react";

const FeeSummaryCards = ({ student }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card title="Total Fee" value={student.totalFee} color="blue" />
      <Card title="Total Paid" value={student.totalPaid} color="green" />
      <Card title="Balance" value={student.balance} color="red" />
      <Card title="Status" value={student.status} color="yellow" />
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div className="bg-white shadow rounded p-4 text-center">
    <h3 className="text-sm font-medium">{title}</h3>
    <p className={`text-xl font-bold text-${color}-600`}>
      {typeof value === "number" ? `₦${value.toLocaleString()}` : value}
    </p>
  </div>
);

export default FeeSummaryCards;
