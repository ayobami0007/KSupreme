// components/common/Button.js
import Loader from "./Loader";

export default function Button({ children, onClick, loading = false, disabled = false }) {
  return (
    <button
      className="cursor-pointer w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
       
          <Loader />
          
       
      ) : (
        children
      )}
    </button>
  );
}
