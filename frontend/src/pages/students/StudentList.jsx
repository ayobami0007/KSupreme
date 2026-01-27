


import { useState, useEffect } from "react";
import PaymentFilters from "./PaymentFilters";
import StudentsTable from "./StudentsTable";
import { useTerm } from "../../context/TermContext";
import { useParams } from "react-router-dom";
import { getClasses } from "../../api/classes.api";
import { getStudentsWithStatus } from "../../api/students.api";
import Loader from "../../components/common/Loader";

const StudentList = () => {
  const { id } = useParams();
  const { activeTerm, loading } = useTerm();

  const [classes, setClasses] = useState([]);
  // const [offset, setOffset] = useState(0);8

  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState("")
  // const [loading, setLoading] = useState(false)
  const limit = 10;




  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 300);
    return () => clearTimeout(delay)
  }, [searchInput])
  // Load classes once
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
        //  console.log("Selected class:", selectedClass);
        // if (data.length > 0) setSelectedClass(data[0].id);
        setSelectedClass("")
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    console.log("Selected class changed:", selectedClass);
  }, [selectedClass]);


  // Load students whenever class or search changes
  useEffect(() => {
    const loadStudents = async () => {
      if (!activeTerm) return;
      try {
        const offset = (currentPage - 1) * limit;

        const data = await getStudentsWithStatus(selectedClass, searchQuery,selectedStatus, limit, offset);
        setStudents(data.rows);
       setTotalPages(Math.ceil(data.totalCount / limit))
     } catch (err) {
        console.error("Failed to load students:", err);
      }
    };
    loadStudents();
  }, [selectedClass, searchQuery, selectedStatus, activeTerm, currentPage]);


  if (loading) return <p><Loader/></p>;
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
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        classes={classes}
        selectedStatus ={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

<div className="bg-white rounded shadow p-4 overflow-x-auto">
  {loading ? (
  
    <div className="flex justify-center py-10">
      <Loader />
    </div>
  ) : students.length === 0 ? (

    <div className="flex justify-center py-10 text-gray-600">
      No students found
    </div>
  ) : (
    // Show table when data exists
    <StudentsTable
      students={students}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  )}
</div>


   
    </div>
  );
};

export default StudentList;
