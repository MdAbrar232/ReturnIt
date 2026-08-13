import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyReports.css";

function MyReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/reports/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not load reports.");
          return;
        }

        setReports(data);
      } catch {
        setError("Could not connect to the server.");
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="reports-page">
      <div className="reports-container">
        <h1>My Reports</h1>

        <p className="reports-subtitle">
          Reports you have submitted
        </p>

        {error && (
          <p className="reports-error">
            {error}
          </p>
        )}

        {reports.length === 0 && !error && (
          <p className="no-reports">
            You haven't submitted any reports yet.
          </p>
        )}

        <div className="reports-list">
          {reports.map((report) => (
            <div className="report-card" key={report.id}>
              <div className="report-header">
                <h2>{report.item.title}</h2>

                <span
                  className={`report-type ${report.type.toLowerCase()}`}
                >
                  {report.type}
                </span>
              </div>

              <p>
                <strong>Description:</strong>{" "}
                {report.description}
              </p>

              <p>
                <strong>Item:</strong>{" "}
                {report.item.description}
              </p>

              <p>
                <strong>Brand:</strong>{" "}
                {report.item.brand}
              </p>

              <p>
                <strong>Color:</strong>{" "}
                {report.item.color}
              </p>

              <p>
                <strong>Condition:</strong>{" "}
                {report.item.condition}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {report.location}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {report.report_date}
              </p>

              {report.type === "LOST" && (
                <button
                  onClick={() =>
                    navigate(`/matches/${report.id}`)
                  }
                >
                  Find Matches
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyReports;