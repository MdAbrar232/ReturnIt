import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="dashboard">
      <h1>
        {isAdmin
          ? "Welcome to ReturnIt — Admin"
          : "Welcome to ReturnIt"}
      </h1>

      <p>
        Welcome, {user?.username || user?.university_id}.
      </p>

      {isAdmin ? (
        <div className="dashboard-actions">
          <button onClick={() => navigate("/admin/claims")}>
            Manage Claims
          </button>

          <button>
            Notifications
          </button>
        </div>
      ) : (
        <div className="dashboard-actions">
          <button onClick={() => navigate("/report")}>
            Report Lost / Found Item
          </button>

          <button onClick={() => navigate("/reports")}>
            View My Reports
          </button>

          <button onClick={() => navigate("/claims")}>
            My Claims
          </button>

          <button>
            Notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;