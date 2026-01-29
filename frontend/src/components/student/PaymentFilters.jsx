
const PaymentFilters = ({
  selectedClass,
  setSelectedClass,
  searchInput,
 setSearchInput,
 selectedStatus,
 setSelectedStatus,
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
           {c.name}{c.track ? ` - ${c.track}` : ""}
          </option>
        ))}
      </select>

      <select value={selectedStatus ?? ""} 
      onChange={(e) => 
        setSelectedStatus(e.target.value ? e.target.value : "")}
       className="border rounded px-3 py-2">

         <option value="">All Statuses</option>
        <option value="Paid">Paid</option>
        {/* <option value="Partially Paid">Partially Paid</option> */}
        <option value="Owing">Owing</option>
        <option value="No Fee Set">No Fee Set</option>
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
