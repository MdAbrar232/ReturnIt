import { useEffect, useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import "./AdminActivityLogs.css";

function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/notifications/admin/logs/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            data.error ||
            "Could not load activity logs."
        );
        return;
      }

      setLogs(data);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="admin-logs-page">
        <div className="admin-logs-container">
          <NavigationButtons />
          <p>Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-logs-page">
      <div className="admin-logs-container">
        <NavigationButtons />

        <h1>Admin Activity Logs</h1>

        <p className="admin-logs-subtitle">
          View important activities performed by
          users and administrators.
        </p>

        {error && (
          <p className="admin-logs-error">
            {error}
          </p>
        )}

        {!error && logs.length === 0 && (
          <p className="admin-logs-message">
            No activity logs found.
          </p>
        )}

        {!error && logs.length > 0 && (
          <div className="admin-logs-list">
            {logs.map((log, index) => (
              <div
                className="admin-log-entry"
                key={index}
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminActivityLogs;