
import { useState } from "react";
import Loader from "../common/Loader"; 

const AddPaymentModal = ({ show, onClose, onSave, balance }) => {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Cash");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [enteredBy, setEnteredBy] = useState("");
  const [loading, setLoading] = useState(false); 

  const resetFields = () => {
    setAmount("");
    setMode("Cash");
    setRemark("");
    setEnteredBy("");
    setError("");
  };

  const handleSave = async () => {

    const confirmed = window.confirm(
      `Are you sure you want to record ₦${Number(amount).toLocaleString()}? This action can not be reversed `
    )
    if (!confirmed) return;

    if (Number(amount) > balance) {
      setError(`Amount cannot exceed remaining balance of ₦${balance.toLocaleString()}`);
      return;
    }
    if (Number(amount) <= 0) {
      setError("Amount must be greater than zero");
      return;
    }
    if (!enteredBy.trim()) {
      setError("Please enter who recorded this payment");
      return;
    }

    try {
      setLoading(true); // start loader
      await onSave({
        amount_paid: Number(amount),
        payment_mode: mode,
        remark,
        entered_by: enteredBy,
      });
      resetFields();
      onClose();
    } catch (err) {
     setError("Failed to save payment. Please try again.");
    } finally {
      setLoading(false); // stop loader
    }
  };

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Payment</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        {/* Form fields */}
        <label className="block mb-2 text-sm font-medium">Amount Paid</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value.trim())}
          className="border w-full mb-4 p-2 rounded"
          placeholder="Enter amount"
          disabled={loading}
        />

        <label className="block mb-2 text-sm font-medium">Payment Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border w-full mb-4 p-2 rounded"
          disabled={loading}
        >
          <option>Cash</option>
          <option>Transfer</option>
          <option>POS</option>
          <option>Bank</option>
        </select>

        <label className="block mb-2 text-sm font-medium">Remark</label>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="border w-full mb-4 p-2 rounded"
          placeholder="Optional remark"
          disabled={loading}
        />

        <label className="block mb-2 text-sm font-medium">Entered By</label>
        <input
          type="text"
          value={enteredBy}
          onChange={(e) => setEnteredBy(e.target.value)}
          className="border w-full mb-4 p-2 rounded"
          placeholder="Who recorded this payment?"
          disabled={loading}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader /> Saving...
              </>
            ) : (
              "Save Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
