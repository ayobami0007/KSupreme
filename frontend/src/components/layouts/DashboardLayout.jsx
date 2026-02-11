import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 print:h-auto print:overflow-visible">
      <Sidebar />
      <main className=" p-6 w-full bg-gray-100 min-h-screen flex-1 overflow-y-auto transition-all duration-300 print:overflow-visible print:h-auto print:p-0">
       <Outlet/>
      </main>
    </div>
  );
} 
