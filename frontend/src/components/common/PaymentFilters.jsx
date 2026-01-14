const PaymentFilters = ({
  selectedClass,
  setSelectedClass,
  searchQuery,
  setSearchQuery,
  classes = []
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="border rounded px-3 py-2"
      >
        {classes.map(c => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search by name or ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
    </div>
  );
};

export default PaymentFilters;
