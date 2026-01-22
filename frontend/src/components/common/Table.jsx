// components/common/Table.js
export default function Table({ headers, data }) {
  return (
    <table className="min-w-full table-auto border text-sm sm:text-base">
      <thead>
        <tr className="bg-gray-100 text-left">
          {headers.map((h, i) => (
            <th key={i} className="p-2 border">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="p-4 text-center text-gray-500">
              No records found
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => (
                <td key={j} className="p-2 border">{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
