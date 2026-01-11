import React from "react";
const SummaryCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold">{stat.label}</h3>
          <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
