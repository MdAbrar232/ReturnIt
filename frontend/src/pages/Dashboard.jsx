import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin = user?.role === "ADMIN";

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch(
        "http://127.0.0.1:8000/api/auth/logout/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
    } catch {
      // Clear local session even if the server request fails.
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome to ReturnIt</h1>

      <p>
        Welcome, {user?.username || user?.university_id}.
      </p>

      <div className="dashboard-actions">

        {!isAdmin && (
          <>
            <button onClick={() => navigate("/report")}>
              Report Lost / Found Item
            </button>

            <button onClick={() => navigate("/reports")}>
              View My Reports
            </button>

            <button onClick={() => navigate("/claims")}>
              My Claims
            </button>
          </>
        )}

        {isAdmin && (
          <button onClick={() => navigate("/admin/claims")}>
            Manage Claims
          </button>
        )}

        <button>
          Notifications
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default Dashboard;