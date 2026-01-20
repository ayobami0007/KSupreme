
const PaymentFilters = ({
  selectedClass,
  setSelectedClass,
  searchInput,
 setSearchInput,
  classes = []
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        value={selectedClass ?? ""}
        onChange={(e) =>
          setSelectedClass(e.target.value ? Number(e.target.value) : null)
        }
        className="border rounded px-3 py-2"
      >
      {/* all class option */}
        <option value="">All Classes</option>

        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}  {c.track && (
                    <span className="text-gray-500 italic"> - {c.track}</span>
                  )}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search by name or ID"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
    </div>
  );
};

export default PaymentFilters;
