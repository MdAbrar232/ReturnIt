import { useEffect, useState } from "react";
import NavigationButtons from "../components/NavigationButtons";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/notifications/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.error || "Could not load notifications."
          );
          return;
        }

        setNotifications(data);
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div>
    <NavigationButtons />
      <h1>Notifications</h1>

      {error && <p>{error}</p>}

      {!error && notifications.length === 0 && (
        <p>No notifications yet.</p>
      )}

      {!error &&
        notifications.map((notification) => (
          <div key={notification.id}>
            <p>{notification.message}</p>
            <small>
              {new Date(
                notification.created_at
              ).toLocaleString()}
            </small>
          </div>
        ))}
    </div>
  );
}

export default Notifications;