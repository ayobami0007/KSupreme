
import { useNavigate } from "react-router-dom";
import SettingsCard from "../../components/common/SettingsCard";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsCard
          title="Students"
          description="Add and manage students"
          onClick={() => navigate("/add/student")}
        />
        <SettingsCard
          title="Classes"
          description="Add and manage classes"
          onClick={() => navigate("/classes")}
        />
        <SettingsCard
          title="Fees"
          description="Configure school fees"
          onClick={() => navigate("/fees")}
        />
        <SettingsCard
          title="Terms"
          description="Add and manage terms"
          onClick={() => navigate("/term")}
        />
        <SettingsCard
          title="Sessions"
          description="Add and manage sessions"
          onClick={() => navigate("/session")}
        />
      </div>
    </div>
  );
}
