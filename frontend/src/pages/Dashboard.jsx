import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="dashboard">
      <h1>Welcome to ReturnIt</h1>

      <p>
        Welcome, {user?.username || user?.university_id}.
      </p>

      <div className="dashboard-actions">
        <button onClick={() => navigate("/report")}>
          Report Lost / Found Item
        </button>

        <button onClick={() => navigate("/reports")}>
            View My Reports
        </button>

        <button>
          Notifications
        </button>
      </div>
    </div>
  );
}

export default Dashboard;