
import { useState ,useEffect} from "react";
import StudentInfoCard from "../../components/student/StudentInfoCard";
import FeeSummaryCards from "../../components/student/FeeSummaryCards";
import PaymentProgress from "../../components/student/PaymentProgress";
import PaymentHistoryTable from "../../components/student/PaymentHistoryTable";
import AddPaymentModal from "../../components/student/AddPaymentModal";
import {useParams} from "react-router-dom";
import { getStudentPaymentInfo , addPayment} from "../../api/payments.api";
import { useTerm } from "../../context/TermContext";


const StudentDashboard = () => {
  // const student = {
  //   name: "Esther Akpan",
  //   id: "IDS 1001",
  //   class: "Primary 1",
  //   totalFee: 50000,
  //   totalPaid: 40000,
  // };

  const {id} = useParams();
  const [student, setStudent] = useState(null);
const {activeTerm} = useTerm();

  const [payments, setPayments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  

//   useEffect(() => {
//   const loadStudent = async () => {
//     console.log("Fetching payment info with:", { id, class_id: studentData?.class_id, term_id: activeTerm.termId });

//     try {
     

//       // Fetch student payment info directly
//       const data = await getStudentPaymentInfo(studentData.id, studentData.class_id, activeTerm.termId);

//       // The backend response already includes class_id and term_id
//       setStudent(data);
//       setPayments(data.payments || []);
//     } catch (err) {
//       console.error("Error loading student:", err);
//     }
//   };
//   if(activeTerm){
// loadStudent();
//   }

  
// }, [id, activeTerm]);
useEffect(() => {
  const loadStudent = async () => {
    try {
      console.log("Fetching payment info with:", { id, term_id: activeTerm.termId });

      // Fetch student payment info directly
      const data = await getStudentPaymentInfo(id, activeTerm.termId);

      // Backend response already includes class_id and term_id
      setStudent(data);
      setPayments(data.payments || []);
    } catch (err) {
      console.error("Error loading student:", err);
    }
  };

  if (activeTerm) {
    loadStudent();
  }
}, [id, activeTerm]);


    if(!student) return <p>Loading....</p>

  // Compute totalPaid dynamically
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

  // const handleAddPayment = async (newPayment) => {
  //   const paymentWithDate = {
  //     ...newPayment,
  //     payment_date: new Date().toISOString(),
  //     enteredBy: "Admin1",
  //   };
  //   setPayments([...payments, paymentWithDate]);

  //   setStudent({
  //     ...student,
  //     total_paid: student.total_paid + Number(newPayment.amount_paid),
  //     balance: student.total_fee - (student.total_paid + Number(newPayment.amount_paid)),
  //   })

  //   setShowAddModal(false);
  // };



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Student Payment Dashboard</h1>

    <StudentInfoCard student={{ ...student, total_paid: totalPaid, balance }} />
      <FeeSummaryCards student={{ ...student, total_paid: totalPaid, balance }} />
      <PaymentProgress totalPaid={totalPaid} totalFee={student.total_fee} />
      <PaymentHistoryTable payments={payments} onAddPayment={() => setShowAddModal(true)} />
 


      <AddPaymentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddPayment}
        balance={balance}
      />
    </div>
  );
};

export default StudentDashboard;
