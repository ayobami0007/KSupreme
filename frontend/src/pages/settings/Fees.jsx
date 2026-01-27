
import { useState, useEffect,  } from "react";
import { getClasses } from "../../api/classes.api";
import { getTerms } from "../../api/terms.api";
import { getFees, setSchoolFee } from "../../api/schoolFees.api";


//  components
import Dropdown from "../../components/common/DropDown";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import Select from "react-select";
import BackArrow from "../../components/common/BackArrow";

export default function FeesPage() {
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [fees, setFees] = useState([]);

  // Selected values
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [amount, setAmount] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter state
  const [filterClass, setFilterClass] = useState("");
  const [filterSession, setFilterSession] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const classData = await getClasses();
        setClasses(classData);

        const termData = await getTerms();
        setTerms(termData);

        // sessions from terms
        const uniqueSessions = [
          ...new Map(
            termData.map((t) => [t.session_id, { id: t.session_id, name: t.session_name }])
          ).values(),
        ];
        setSessions(uniqueSessions);

        const feeData = await getFees();
        setFees(feeData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedClass) return setError("Class is required");
    if (!selectedSession) return setError("Session is required");
    if (!selectedTerm) return setError("Term is required");
    if (!amount) return setError("Amount is required");

    setLoading(true);
    try {
      await setSchoolFee({
        class_id: Number(selectedClass),
        term_id: Number(selectedTerm),
        amount: Number(amount),
      });
      const updatedFees = await getFees();
      setFees(updatedFees);

      setSelectedClass("");
      setSelectedSession("");
      setSelectedTerm("");
      setAmount("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // class filter
  const filteredFees = fees.filter((f) => {
   const matchClass = filterClass ? f.class_name === filterClass : true;
   const matchSesssion  = filterSession ? f.session_name === filterSession : true;
   return matchClass && matchSesssion
  });

  const displayedFees = 
  filterSession ===  "" ? filteredFees.slice(0, 20) : filteredFees

  // Session options for React Select
  const sessionOptions = sessions.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <BackArrow/>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">School Fees Management</h1>

      {/* Fee Setup Form */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Set School Fee</h2>

        <div className="space-y-4">
          {/* Session Dropdown (searchable) */}
          <div>
            <label className="block text-sm font-medium mb-1">Session</label>
            <Select
              options={sessionOptions}
              value={sessionOptions.find((opt) => opt.value === selectedSession)}
              onChange={(opt) => {
                setSelectedSession(opt.value);
                setError("");
              }}
              placeholder="Select Session"
            />
          </div>

          <Dropdown
            label="Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={classes.map((c) => ({
              value: c.id,
              label: c.track ? `${c.name}  - ${c.track} ` : c.name
            }))}
            required
          />

          <Dropdown
            label="Term"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            options={terms
              .filter((t) => t.session_id === Number(selectedSession))
              .map((t) => ({ value: t.id, label: t.name }))}
            required
          />

                    <Input
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}


          <Button onClick={handleSubmit} loading={loading}>
            Add Fee
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Fees List</h2>

        <div className="flex gap-4 mb-4">
          <Dropdown
            label="Filter by Class"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            options={[
              { value: "", label: "All Classes" },
              ...classes.map((c) => ({
                value: c.name,
                label: c.track ? `${c.name} - ${c.track}` : c.name
              })),
            ]}
            className="w-48"
          />

          <Dropdown
          label="Filter By Session"
          value={filterSession}
          onChange={(e) => setFilterSession(e.target.value)}
            options ={[
              {value: "", label : "All Sessions"},
              ...sessions.map((s) => ({
                value: s.name,
                label: s.name
              })),
            ]}
         className="w-48"
          />
        </div>
        <Table
          headers={["Class", "Term", "Amount"]}
          data={displayedFees.map((f) => [f.class_name, f.term_name, f.amount])}
        />
      </div>
    </div>
  );
}
