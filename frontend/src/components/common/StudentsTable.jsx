import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";



const StudentsTable = ({ students, currentPage, totalPages, onPageChange }) => {
  if (students.length === 0) {
    return <div className="text-center py-10 text-gray-500">No students found.</div>;
  }

  // Helper to generate windowed page numbers
  const getPageNumbers = () => {
    const pages = [];
    const windowSize = 2;

    // Always include first page
    if (currentPage > windowSize + 1) {
      pages.push(1);
      if (currentPage > windowSize + 2) {
        pages.push("...");
      }
    }

    // Pages around current
    for (let i = currentPage - windowSize; i <= currentPage + windowSize; i++) {
      if (i > 0 && i <= totalPages) {
        pages.push(i);
      }
    }

   
    if (currentPage < totalPages - windowSize) {
      if (currentPage < totalPages - windowSize - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Students</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Student ID</th>
              <th className="p-3">Student Name</th>
              <th className="p-3">Class</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.class}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded font-semibold ${
                      s.status === "Paid"
                        ? "bg-green-500 text-white"
                        : s.status === "No Fee Set"
                        ? "bg-gray-400 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link to={`/students/${s.id}/payment`}>
                    <button
                    aria-label={`Manage payment for ${s.name}`}
                    className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">
                      {s.status === "Paid" ? "View" : "Pay"}
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-3 py-1">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};


export default StudentsTable;
