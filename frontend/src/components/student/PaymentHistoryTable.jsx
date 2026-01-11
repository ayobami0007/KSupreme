

const PaymentHistoryTable = ({ payments, onAddPayment }) => {
  return (
    <div className="bg-white shadow rounded p-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Payment History</h2>
        <button
          onClick={onAddPayment}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Payment
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No payments recorded yet.
        </div>
      ) : (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Mode</th>
              <th className="p-2">Entered By</th>
              <th className="p-2">Remark</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{p.date}</td>
                <td className="p-2">₦{Number(p.amount).toLocaleString()}</td>
                <td className="p-2">{p.mode}</td>
                <td className="p-2">{p.enteredBy}</td>
                <td className="p-2">{p.remark || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistoryTable