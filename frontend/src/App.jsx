import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyReports from "./pages/MyReports";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportForm from "./pages/ReportForm";
import Matches from "./pages/Matches";
import ClaimForm from "./pages/ClaimForm";
import MyClaims from "./pages/MyClaims";
import ClaimDetails from "./pages/ClaimDetails";
import AdminClaims from "./pages/AdminClaims";
import Signup from "./pages/Signup";
import BrowseReports from "./pages/BrowseReports";
import ReportDetails from "./pages/ReportDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="/browse" element={<BrowseReports />} />

        <Route
          path="/matches/:reportId"
          element={<Matches />}
        />

        <Route
          path="/claim/:itemId"
          element={<ClaimForm />}
        />

        <Route
          path="/claims"
          element={<MyClaims />}
        />

        <Route
          path="/claims/:claimId"
          element={<ClaimDetails />}
        />

        <Route
          path="/admin/claims"
          element={<AdminClaims />}
        />
        <Route
          path="/report/:reportId"
          element={<ReportDetails />}
        />
        {/* Keep wildcard LAST */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;