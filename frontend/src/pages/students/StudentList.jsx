import { useState } from "react";
import PaymentFilters from "../../components/common/PaymentFilters";
import StudentsTable from "../../components/common/StudentsTable";
import RecentPaymentsTable from "../../components/common/RecentsPay";
import { useTerm } from "../../context/TermContext";
import { useParams } from "react-router-dom";


const StudentList = () => {

const { id } = useParams();

  const [selectedClass, setSelectedClass] = useState("Primary 1");
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    { id: "IDS 1001", name: "Esther Akpan", class: "Primary 1", status: "Paid" },
    { id: "IDS 1002", name: "Emeka Eze", class: "Primary 1", status: "Owing" },
    { id: "IDS 1003", name: "Amina Bello", class: "Primary 1", status: "Owing" },
    { id: "IDS 1004", name: "Ibrahim Yusuf", class: "Primary 1", status: "Owing" },
  ];

  const filteredStudents = students.filter(
    (s) =>
      s.class === selectedClass &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const recentPayments = students.filter((s) => s.status === "Paid");

   const { activeTerm, loading } = useTerm();
  if (loading) return <p>Loading....</p>
  if(!activeTerm) return <p>No active term found</p>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Student Payment Management</h1>
       <p className="mb-4">
        <strong>Active Term:</strong> {activeTerm.session} – {activeTerm.term}
      </p>
      <PaymentFilters
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <StudentsTable students={filteredStudents} />

      <RecentPaymentsTable payments={recentPayments} />
      
    </div>
  );
};

export default StudentList;



