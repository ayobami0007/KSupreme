


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import DashboardLayout from "../components/layouts/DashboardLayout"; 
import Dashboard from '../pages/dashboard/dashboard'
import Students from "../pages/students/StudentList";
import Payments from "../pages/payments/PaymentDashboard";
import Reports from "../pages/Reports";
import Settings from "../pages/settings/Settings"
import SessionsPage from "../pages/settings/Sessions";
import TermsPage from "../pages/settings/Terms";
import ClassManagement from "../pages/settings/Classes";
import FeesPage from "../pages/settings/Fees";
import AddStudent from "../pages/settings/AddStudent" 
import ProtectedRoute from "./ProtectedRoute";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected dashboard routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes inside Dashboard */}
          <Route index element={<Navigate to ='dashboard' replace/>} />
          <Route path="*" element={<h1>Page Not Found</h1>} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id/payment" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="session" element={<SessionsPage />} />
          <Route path ="term" element={<TermsPage />} />
          <Route path="classes" element={<ClassManagement />}/> 
          <Route path="fees" element={<FeesPage/>}/>
          <Route path="add/student" element={<AddStudent/>} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
