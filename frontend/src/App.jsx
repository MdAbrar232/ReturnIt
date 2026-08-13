import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyReports from "./pages/MyReports";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportForm from "./pages/ReportForm";
import Matches from "./pages/Matches";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="*" element={<Login />} />
        <Route path="/matches/:reportId" element={<Matches />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;