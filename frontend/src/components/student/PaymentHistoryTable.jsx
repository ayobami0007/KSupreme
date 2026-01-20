

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
<table className="w-full table-auto border-collapse">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-2 text-left">Date</th>
      <th className="p-2 text-left">Amount</th>
      <th className="p-2 text-left">Mode</th>
      <th className="p-2 text-left">Entered By</th>
      <th className="p-2 text-left">Remark</th>
      {/* <th className="p-2 text-left">Status</th> */}
    </tr>
  </thead>
  <tbody>
    {payments.map((p, idx) => (
      <tr key={idx} className="border-t">
        <td className="p-2 text-left">
          {new Date(p.payment_date).toLocaleDateString()}
        </td>
        <td className="p-2 text-left">
          ₦{Number(p.amount_paid).toLocaleString()}
        </td>
        <td className="p-2 text-left">{p.payment_mode}</td>
        <td className="p-2 text-left">{p.entered_by}</td>
        <td className="p-2 text-left">{p.remark || "-"}</td>
        {/* <td className="p-2 text-left"> 
          <button 
           className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
          //  onClick={() => }
           >
            Void & Correct
          </button>
        </td> */}
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
  );
};

export default PaymentHistoryTable