// import { useEffect, useState } from "react";
// import PaymentFilters from "../../components/common/PaymentFilters";
// import StudentsTable from "../../components/common/StudentsTable";
// import RecentPaymentsTable from "../../components/common/RecentsPay";
// import { useTerm } from "../../context/TermContext";
// import { useParams } from "react-router-dom";
// import { getClasses } from "../../api/classes.api";


// const StudentList = () => {

// const { id } = useParams();
// const { activeTerm, loading } = useTerm();

//   const [selectedClass, setSelectedClass] = useState("Primary 1");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [classes, setClasses] = useState([])
//   const [students, setStudents] = useState([]);

//   useEffect(() =>{
//     const loadClasses = async () => {
//       try{
//         const data = await getClasses();
//         setClasses(data);
//         if(data.length > 0) setSelectedClass(data[0].name)
//       } catch (err){
//     console.error("failed to load classes", err)
//   }
//     } loadClasses();    
//   }, [])

//   // const students = [
//   //   { id: "IDS 1001", name: "Esther Akpan", class: "Primary 1", status: "Paid" },
//   //   { id: "IDS 1002", name: "Emeka Eze", class: "Primary 1", status: "Owing" },
//   //   { id: "IDS 1003", name: "Amina Bello", class: "Primary 1", status: "Owing" },
//   //   { id: "IDS 1004", name: "Ibrahim Yusuf", class: "Primary 1", status: "Owing" },
//   // ];

//   const filteredStudents = students.filter(
//     (s) =>
//       s.class === selectedClass &&
//       (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         s.id.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   const recentPayments = students.filter((s) => s.status === "Paid");

   
//   if (loading) return <p>Loading....</p>
//   if(!activeTerm) return <p>No active term found</p>

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold">Student Payment Management</h1>
//        <p className="mb-4">
//         <strong>Active Term:</strong> {activeTerm.session} – {activeTerm.term}
//       </p>
//       <PaymentFilters
//         selectedClass={selectedClass}
//         setSelectedClass={setSelectedClass}
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//       />

//       <StudentsTable students={filteredStudents} />

//       <RecentPaymentsTable payments={recentPayments} />
      
//     </div>
//   );
// };

// export default StudentList;


import { useState, useEffect } from "react";
import PaymentFilters from "../../components/common/PaymentFilters";
import StudentsTable from "../../components/common/StudentsTable";
import { useTerm } from "../../context/TermContext";
import { useParams } from "react-router-dom";
import { getClasses } from "../../api/classes.api";
import { getStudentsByClass } from "../../api/students.api";

const StudentList = () => {
  const { id } = useParams();
  const { activeTerm, loading } = useTerm();

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);

  // Load classes once
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
        if (data.length > 0) setSelectedClass(data[0].id); // ✅ use ID instead of name
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };
    loadClasses();
  }, []);

  // Load students whenever class or search changes
  useEffect(() => {
    const loadStudents = async () => {
      if (!activeTerm || !selectedClass) return;
      try {
        const data = await getStudentsByClass(selectedClass, activeTerm.id, searchQuery);
        setStudents(data);
      } catch (err) {
        console.error("Failed to load students:", err);
      }
    };
    loadStudents();
  }, [selectedClass, searchQuery, activeTerm]);

  if (loading) return <p>Loading....</p>;
  if (!activeTerm) return <p>No active term found</p>;

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
        classes={classes}
      />

      <StudentsTable students={students} />
    </div>
  );
};

export default StudentList;
