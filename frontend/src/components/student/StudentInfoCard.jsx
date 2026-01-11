import { useTerm } from "../../context/TermContext";

const StudentInfoCard = ({ student }) => {
  const { activeTerm } = useTerm();

  if(!activeTerm) return null;

  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
      <p><strong>Student ID:</strong> {student.id}</p>
      <p><strong>Class:</strong> {student.class}</p>
      <p>
        <strong>Active Term:</strong> {activeTerm.session} – {activeTerm.term}
      </p>
    </div>
  );
};

export default StudentInfoCard;
