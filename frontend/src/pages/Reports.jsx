import React, { useEffect, useState } from 'react'
import { getPaymentReport } from '../api/students.api'
import { getClasses } from "../api/classes.api";
import DropDown from "../components/common/DropDown"
import Table from "../components/common/Table"
import Loader from '../components/common/Loader'
import Button from '../components/common/Button';

export default function PaymentReportPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState("")
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [students, setStudents] = useState([])

  // Load classes on mount
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data)
      } catch (err) {
        console.error("failed to load classes", err)
      }
    };
    loadClasses();
  }, [])

  // Load report
  const loadReport = async () => {
    if (!selectedClasses) {
      alert("Please select a class");
      return;
    }
    
    setLoading(true);
    try {
      const data = await getPaymentReport({
        classId: selectedClasses,
        paymentStatus: filter
      })
      setStudents(data);
    } catch (err) {
      console.error("Error fetching report:", err);
      alert("Failed to load report. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  // Print function
  const handlePrint = () => {
    window.print();
  }

  // Format display for amount/status
  const formatAmountDisplay = (student) => {
    if (student.payment_status === "Fully Paid") {
      return "Fully Paid";
    } else if (student.payment_status === "Not Paid") {
      return "Not Paid";
    } else {
      // Partial payment - show amount left
      return `₦${parseFloat(student.balance).toLocaleString()} left`;
    }
  }


  const tableData = students.map((student, index) => [
    index + 1,  // S/N
    student.name,  // Student Name
    student.class,  // Class
    `₦${parseFloat(student.total_fee).toLocaleString()}`,  // Total Fee
    `₦${parseFloat(student.total_paid).toLocaleString()}`,  // Amount Paid
    formatAmountDisplay(student)  // Status/Balance
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Payment Report</h1>

      {/* hide when printing */}
      <div className="mb-6 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <DropDown
            label="Class"
            value={selectedClasses}
            onChange={(e) => setSelectedClasses(e.target.value)}
            options={classes.map(c => ({
              value: c.id,
              label: c.name
            }))}
            required
          />

          <DropDown
            label="Payment Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "", label: "All Students" },
              { value: "fully_paid", label: "Fully Paid" },
              { value: "partial", label: "Partial Payment" },
              { value: "not_paid", label: "Not Paid" }
            ]}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={loadReport}>Generate Report</Button>
          
          {students.length > 0 && (
            <Button onClick={handlePrint}>
              Print Report
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <Loader />
      ) : students.length > 0 ? (
        <div>
          {/*  only shows when printing */}
          <div className="hidden print:block mb-4 text-center">
            <h2 className="text-2xl font-bold">Payment Report</h2>
            <p className="mt-2">
              <strong>Class:</strong> {classes.find(c => c.id === parseInt(selectedClasses))?.name}
            </p>
            <p>
              <strong>Filter:</strong> {
                filter 
                  ? filter.replace("_", " ").charAt(0).toUpperCase() + filter.replace("_", " ").slice(1)
                  : "All Students"
              }
            </p>
            <p className="text-sm mt-1">
              Generated: {new Date().toLocaleDateString('en-NG', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <hr className="my-4" />
          </div>

          {/* Table */}
          <Table
            headers={["S/N", "Student Name", "Class", "Total Fee", "Amount Paid", "Status/Balance"]}
            data={tableData}
          />

          {/* Summary section */}
          <div className="mt-6 p-4 bg-gray-100 rounded border">
            <h3 className="font-bold text-lg mb-3">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-xl font-semibold">{students.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-xl font-semibold">
                  ₦{students
                    .reduce((sum, s) => sum + parseFloat(s.total_fee || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Collected</p>
                <p className="text-xl font-semibold text-green-600">
                  ₦{students
                    .reduce((sum, s) => sum + parseFloat(s.total_paid || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Outstanding</p>
                <p className="text-xl font-semibold text-red-600">
                  ₦{students
                    .reduce((sum, s) => sum + parseFloat(s.balance || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded border border-dashed">
          <p className="text-gray-500">
            Select a class and click "Generate Report" to view payment data
          </p>
        </div>
      )}
    </div>
  )
}