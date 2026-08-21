import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import MyReports from "./pages/MyReports";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportForm from "./pages/ReportForm";
import Matches from "./pages/Matches";
import ClaimForm from "./pages/ClaimForm";
import MyClaims from "./pages/MyClaims";
import ClaimDetails from "./pages/ClaimDetails";
import AdminClaims from "./pages/AdminClaims";
import AdminReports from "./pages/AdminReports";
import Signup from "./pages/Signup";
import BrowseReports from "./pages/BrowseReports";
import ReportDetails from "./pages/ReportDetails";
import Notifications from "./pages/Notifications";
import AdminActivityLogs from "./pages/AdminActivityLogs";


function App() {
      const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
          {token && <Navbar />}
      <Routes>

  {/* Public */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />


  {/* Student/User Protected Routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />


  <Route
    path="/report"
    element={
      <ProtectedRoute>
        <ReportForm />
      </ProtectedRoute>
    }
  />


  <Route
    path="/reports"
    element={
      <ProtectedRoute>
        <MyReports />
      </ProtectedRoute>
    }
  />


  <Route
    path="/browse"
    element={
      <ProtectedRoute>
        <BrowseReports />
      </ProtectedRoute>
    }
  />


  <Route
    path="/notifications"
    element={
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    }
  />


  <Route
    path="/matches/:reportId"
    element={
      <ProtectedRoute>
        <Matches />
      </ProtectedRoute>
    }
  />


  <Route
    path="/claim/:itemId"
    element={
      <ProtectedRoute>
        <ClaimForm />
      </ProtectedRoute>
    }
  />


  <Route
    path="/claims"
    element={
      <ProtectedRoute>
        <MyClaims />
      </ProtectedRoute>
    }
  />


  <Route
    path="/claims/:claimId"
    element={
      <ProtectedRoute>
        <ClaimDetails />
      </ProtectedRoute>
    }
  />


  <Route
    path="/report/:reportId"
    element={
      <ProtectedRoute>
        <ReportDetails />
      </ProtectedRoute>
    }
  />


  <Route
    path="/report/edit/:reportId"
    element={
      <ProtectedRoute>
        <ReportForm />
      </ProtectedRoute>
    }
  />


  {/* Admin Protected Routes */}
  <Route
    path="/admin/claims"
    element={
      <ProtectedRoute adminOnly>
        <AdminClaims />
      </ProtectedRoute>
    }
  />


  <Route
    path="/admin/reports"
    element={
      <ProtectedRoute adminOnly>
        <AdminReports />
      </ProtectedRoute>
    }
  />


  <Route
    path="/admin/logs"
    element={
      <ProtectedRoute adminOnly>
        <AdminActivityLogs />
      </ProtectedRoute>
    }
  />


  {/* Fallback */}
  <Route path="*" element={<Login />} />

</Routes>
    </BrowserRouter>
  );
}

export default App;