import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png"
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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  // Navigation configuration
  const navLinks = [
    { to: "/", label: "Dashboard", icon: HomeIcon },
    { to: "/payment", label: "Payment", icon: CreditCardIcon },
    { to: "/students", label: "Students", icon: AcademicCapIcon },
    { to: "/reports", label: "Reports", icon: ChartBarIcon },
    { to: "/settings", label: "Settings", icon: Cog6ToothIcon },
  ];

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
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 overflow-hidden print:hidden`}
      >
       <div className="flex flex-col items-center gap-2 p-6">
  <img src={Logo} alt="company logo" className="w-16 h-16 object-contain" />
  <h2 className="font-bold text-lg text-center">Supreme Schools Portal</h2>
</div>

        <nav className="mt-6 flex flex-col gap-2 px-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `p-2 rounded flex items-center gap-2 border-l-4 
                ${
                  isActive
                    ? "border-white bg-blue-800 font-semibold"
                    : "border-transparent hover:bg-blue-700"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 px-4 w-full">
          <button
            className="w-full cursor-pointer p-2 rounded flex items-center gap-2 hover:bg-blue-700"
            onClick={handleLogout}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}