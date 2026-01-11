const PaymentFilters = ({
  selectedClass,
  setSelectedClass,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option>Primary 1</option>
        <option>Primary 2</option>
        <option>Primary 3</option>
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
