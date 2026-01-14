import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";

const StudentsTable = ({ students }) => {
  // const {id } = useParams();
  if (students.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No students found for this class or search.
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Students</h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Student ID</th>
              <th className="p-2">Student Name</th>
              <th className="p-2">Class</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.id}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.class}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      s.status === "Paid"
                        ? "bg-green-200"
                        : "bg-orange-200"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-2">
                  <Link to={`/students/${s.id}/payment`}>
                  <button className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">
                    {s.status === "Paid" ? "View" : "Pay"}
                  </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTable;
