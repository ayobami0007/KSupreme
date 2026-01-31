import React from "react";
const SummaryCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center text-center transition hover:shadow-md"
        >
          <h3 className="text-base sm:text-lg font-medium text-gray-700">{stat.label}</h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};


export default SummaryCards;
