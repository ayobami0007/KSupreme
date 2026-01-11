const PaymentProgress = ({ totalPaid, totalFee }) => {
  const percent = Math.min((totalPaid / totalFee) * 100, 100);

  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <p className="text-sm mb-2">Payment Progress</p>
      <div className="w-full bg-gray-200 rounded h-3">
        <div
          className="bg-green-500 h-3 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs mt-1 text-gray-600">{percent.toFixed(0)}% paid</p>
    </div>
  );
};

export default PaymentProgress;
