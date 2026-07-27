// import React from "react";
// const SummaryCards = ({ stats }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//       {stats.map((stat, idx) => (
//         <div
//           key={idx}
//           className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center text-center transition hover:shadow-md"
//         >
//           <h3 className="text-base sm:text-lg font-medium text-gray-700">{stat.label}</h3>
//           <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">{stat.value}</p>
//         </div>
//       ))}
//     </div>
//   );
// };


// export default SummaryCards;
import React from "react";

const cardStyles = {
  "Total Students": {
    bg: "bg-blue-50",
    border: "border-l-4 border-blue-500",
    text: "text-blue-600",
  },
  "Fully Paid Students": {
    bg: "bg-green-50",
    border: "border-l-4 border-green-500",
    text: "text-green-600",
  },
  "Owing Students": {
    bg: "bg-orange-50",
    border: "border-l-4 border-orange-500",
    text: "text-orange-600",
  },
  "Total Amount Collected": {
    bg: "bg-green-50",
    border: "border-l-4 border-green-500",
    text: "text-green-600",
  },
  "Total fee for term": {
    bg: "bg-blue-50",
    border: "border-l-4 border-blue-500",
    text: "text-blue-600",
  },
};

const SummaryCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const style = cardStyles[stat.label] || {
          bg: "bg-white",
          border: "",
          text: "text-blue-600",
        };
        return (
          <div
            key={idx}
            className={`${style.bg} ${style.border} shadow rounded-lg p-4 flex flex-col items-center justify-center text-center transition hover:shadow-md`}
          >
            <h3 className="text-base sm:text-lg font-medium text-gray-700">
              {stat.label}
            </h3>
            <p className={`text-xl sm:text-2xl font-bold mt-2 ${style.text}`}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;