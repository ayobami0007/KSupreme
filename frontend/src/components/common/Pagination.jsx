// export default function Pagination({ currentPage, totalCount, pageSize, onPageChange }) {
//   const totalPages = Math.ceil(totalCount / pageSize);

//   if (totalPages <= 1) return null;

//   const handlePrev = () => {
//     if (currentPage > 1) onPageChange(currentPage - 1);
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) onPageChange(currentPage + 1);
//   };

//   return (
//     <div className="flex justify-center mt-4 space-x-2">
//       {/* Previous button */}
//       <button
//         onClick={handlePrev}
//         disabled={currentPage === 1}
//         className={`px-3 py-1 rounded ${
//           currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200"
//         }`}
//       >
//         Previous
//       </button>

//       {/* Page numbers */}
//       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`px-3 py-1 rounded ${
//             page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
//           }`}
//         >
//           {page}
//         </button>
//       ))}

//       {/* Next button */}
//       <button
//         onClick={handleNext}
//         disabled={currentPage === totalPages}
//         className={`px-3 py-1 rounded ${
//           currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200"
//         }`}
//       >
//         Next
//       </button>
//     </div>
//   );
// }


export default function Pagination({ currentPage, totalCount, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // how many numbers to show around current

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      end = Math.min(totalPages, maxVisible);
    }
    if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - (maxVisible - 1));
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center mt-4 space-y-2">
      <div className="flex space-x-2">
        {/* Previous */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-200"
          }`}
        >
          Prev
        </button>

        {/* First page + ellipsis */}
        {pageNumbers[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="px-3 py-1 rounded bg-gray-200">
              1
            </button>
            {pageNumbers[0] > 2 && <span className="px-2">…</span>}
          </>
        )}

        {/* Visible page numbers */}
        {pageNumbers.map((page) => (
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

        {/* Last page + ellipsis */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="px-2">…</span>}
            <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 rounded bg-gray-200">
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
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

   
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
