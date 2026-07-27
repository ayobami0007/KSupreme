import React from "react";


const cardStyles = {
  "Total Students": {
    border: "border-l-4 border-slate-700",
    text: "text-slate-800",
  },
  "Fully Paid Students": {
    border: "border-l-4 border-emerald-600",
    text: "text-emerald-600",
  },
  "Owing Students": {
    border: "border-l-4 border-amber-500",
    text: "text-amber-600",
  },
  "Total Amount Collected": {
    border: "border-l-4 border-slate-700",
    text: "text-slate-800",
  },
  "Total fee for term": {
    border: "border-l-4 border-slate-400",
    text: "text-slate-700",
  },
};

const SummaryCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const style = cardStyles[stat.label] || {
          border: "border-l-4 border-slate-400",
          text: "text-slate-800",
        };

        return (
          <div
            key={idx}
            className={`bg-white ${style.border} shadow-sm rounded-r-lg rounded-l-sm p-4 flex flex-col justify-between text-center transition hover:shadow-md min-h-[110px]`}
          >
            {/* Standardized header container for baseline alignment */}
            <div className="min-h-[2.5rem] flex items-center justify-center">
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </h3>
            </div>

            {/* Metric Value using limited palette */}
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