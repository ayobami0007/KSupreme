export default function Pagination({ currentPage, totalCount, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center mt-4 space-x-2">
      {/* Previous button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200"
        }`}
      >
        Previous
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200"
        }`}
      >
        Next
      </button>
    </div>
  );
}
