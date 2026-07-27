import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#16a34a", "#ea580c"]; // green for paid, orange for owing

const PaymentDonutChart = ({ fullyPaid, owing, title }) => {
  const data = [
    { name: "Fully Paid", value: fullyPaid },
    { name: "Owing", value: owing },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
      <PieChart width={250} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PaymentDonutChart;