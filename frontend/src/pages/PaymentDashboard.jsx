
import { useState ,useEffect} from "react";
import StudentInfoCard from "../components/student/StudentInfoCard";
import FeeSummaryCards from "../components/student/FeeSummaryCards";
import PaymentProgress from "../components/student/PaymentProgress";
import PaymentHistoryTable from "../components/student/PaymentHistoryTable";
import AddPaymentModal from "../components/student/AddPaymentModal";

import {useParams} from "react-router-dom";
import { getStudentPaymentInfo , addPayment} from "../api/payments.api";
// import { useTerm } from "../../context/TermContext";
import Loader from "../components/common/Loader";
import ReceiptModal from "../components/student/ReceiptModal";
import BackArrow from "../components/common/BackArrow";


const StudentDashboard = () => {



  const {id} = useParams();
  const [student, setStudent] = useState(null);


  const [payments, setPayments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null)
  
const [showReceipt, setShowReceipt] = useState(false);
 const [selectedPayment, setSelectedPayment] = useState(null);

  
useEffect(() => {
  const loadStudent = async () => {
    try {
      // console.log("Fetching payment info  with:", { id });
      const data = await getStudentPaymentInfo(id);
      setStudent(data);
      setPayments(data.payments || []);
    } catch (err) {
      console.error("Error loading student:", err);
      setError(err.response?.data?.error || "Failed to load student data")
    }
  };

  loadStudent();
}, [id]);


if(error) return <p className="text-red-600">{error}</p>
    if(!student) return <Loader/>

  // Compute totalPaid 
  const totalPaid = student.total_paid 
  const balance = student.balance;

  const handleAddPayment = async(newPayment) =>{
    try{
      const payload = {
        ...newPayment,
        student_id : student.id,
        class_id : student.class_id,
        term_id : student.term_id

     }
     const res = await addPayment(payload);

     setPayments([...payments, res.payment])
     setStudent({
      ...student,
      total_paid : res.total_paid,
      balance : res.balance

      
     });
     setShowAddModal(false)
     console.log("Sending payment payload:", payload);

    } catch(error){
      console.error("Error saving payments:", error)
      alert(error.response?.data?.error || "Failed to save payment. Please Try again.")
    }
  }

  
const handlePrintReceipt = (payment) =>{
  setSelectedPayment(payment)
  setShowReceipt(true)
}


  return (
    <div className="p-6 bg-gray-50 min-h-screen ">
       <BackArrow/>
      <h1 className="text-2xl font-bold mb-6">Student Payment Dashboard</h1>

    <StudentInfoCard student={{ ...student, total_paid: totalPaid, balance }} />
      <FeeSummaryCards student={{ ...student, total_paid: totalPaid, balance }} />
      <PaymentProgress totalPaid={totalPaid} totalFee={student.total_fee} />
      <PaymentHistoryTable payments={payments} onAddPayment={() => setShowAddModal(true)}
      onPrintReceipt={handlePrintReceipt} />
 


      <AddPaymentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddPayment}
        balance={balance}
      />
      <ReceiptModal
      isOpen={showReceipt}
      onClose={() => setShowReceipt(false)}
      payment={selectedPayment}
      student={student}
      />
    </div>
  );
};

export default StudentDashboard;
