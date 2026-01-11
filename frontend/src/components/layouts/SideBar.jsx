import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CreditCardIcon,
  AcademicCapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-blue-900 text-white fixed">
      <div className="p-6 font-bold text-lg">
        School Portal
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-4">
        <NavLink to="/" className="p-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <HomeIcon className="h-5 w-5" /> Dashboard
        </NavLink>

        <NavLink to="/payment" className="p-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <CreditCardIcon className="h-5 w-5" /> Payment
        </NavLink>

        <NavLink to="/students" className="p-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <AcademicCapIcon className="h-5 w-5" /> Students
        </NavLink>

        <NavLink to="/reports" className="p-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5" /> Reports
        </NavLink>

        <NavLink to="/settings" className="p-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Cog6ToothIcon className="h-5 w-5" /> Settings
        </NavLink>
      </nav>

      <div className="absolute bottom-4 px-4 w-full">
        <button className="w-full bg-red-600 p-2 rounded flex items-center gap-2">
          <ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout
        </button>
      </div>
    </aside>
  );
}
