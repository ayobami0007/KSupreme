
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {useAuth } from "../../context/AuthContext"
import {
  HomeIcon,
  CreditCardIcon,
  AcademicCapIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();   // get logout from context
  const navigate = useNavigate(); // for redirect

  const handleLogout = () => {
    logout();            // clear token + user
    setIsOpen(false);    // close sidebar
    navigate("/login");  // redirect to login page
  };

  return (
    <>
      <button
        className="md:hidden p-4 text-white bg-blue-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 h-screen bg-blue-900
        text-white transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 overflow-hidden`}
      >
        <div className="p-6 font-bold text-lg">School Portal</div>

        <nav className="mt-6 flex flex-col gap-2 px-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 border-l-4 
              ${isActive
                ? "border-white bg-blue-800 font-semibold"
                : "border-transparent hover:bg-blue-700"}`
            }
            onClick={() => setIsOpen(false)}
          >
            <HomeIcon className="h-5 w-5" /> Dashboard
          </NavLink>

          <NavLink
            to="/payment"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 border-l-4 
              ${isActive
                ? "border-white bg-blue-800 font-semibold"
                : "border-transparent hover:bg-blue-700"}`
            }
            onClick={() => setIsOpen(false)}
          >
            <CreditCardIcon className="h-5 w-5" /> Payment
          </NavLink>

          <NavLink
            to="/students"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 border-l-4 
              ${isActive
                ? "border-white bg-blue-800 font-semibold"
                : "border-transparent hover:bg-blue-700"}`
            }
            onClick={() => setIsOpen(false)}
          >
            <AcademicCapIcon className="h-5 w-5" /> Students
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 border-l-4 
              ${isActive
                ? "border-white bg-blue-800 font-semibold"
                : "border-transparent hover:bg-blue-700"}`
            }
            onClick={() => setIsOpen(false)}
          >
            <ChartBarIcon className="h-5 w-5" /> Reports
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `p-2 rounded flex items-center gap-2 border-l-4 
              ${isActive
                ? "border-white bg-blue-800 font-semibold"
                : "border-transparent hover:bg-blue-700"}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Cog6ToothIcon className="h-5 w-5" /> Settings
          </NavLink>
        </nav>

        <div className="absolute bottom-4 px-4 w-full">
          <button
            className="w-full cursor-pointer p-2 rounded flex items-center gap-2 hover:bg-blue-700"
            onClick={handleLogout}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
