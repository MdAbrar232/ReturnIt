import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ReportDetails.css";
import NavigationButtons from "../components/NavigationButtons";

function ReportDetails() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/reports/${reportId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not load report.");
          return;
        }

        setReport(data);
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <div className="report-details-page">
        <p>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-details-page">
        <p className="report-details-error">
          {error}
        </p>

        <button onClick={() => navigate("/browse")}>
          Back to Reports
        </button>
      </div>
    );
  }

  return (
    <div className="report-details-page">
      <div className="report-details-container">
        <NavigationButtons />
        <button
          className="back-button"
          onClick={() => navigate("/browse")}
        >
          ← Back to Reports
        </button>

        <div className="report-details-card">

          <div className="report-details-header">
            <div>
              <h1>{report.item.title}</h1>

              <p className="report-category">
                {report.item.category.name}
              </p>
            </div>

            <span
              className={`report-type-badge ${report.type.toLowerCase()}`}
            >
              {report.type}
            </span>
          </div>

          <div className="report-section">
            <h2>Item Information</h2>

            <p>
              <strong>Description:</strong>{" "}
              {report.item.description}
            </p>

            <p>
              <strong>Brand:</strong>{" "}
              {report.item.brand || "Not specified"}
            </p>

            <p>
              <strong>Color:</strong>{" "}
              {report.item.color || "Not specified"}
            </p>

            <p>
              <strong>Condition:</strong>{" "}
              {report.item.condition}
            </p>
          </div>

          <div className="report-section">
            <h2>Report Information</h2>

            <p>
              <strong>Type:</strong>{" "}
              {report.type}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {report.location.name}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {report.report_date}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {report.status}
            </p>

            <p>
              <strong>Report Description:</strong>{" "}
              {report.description}
            </p>
          </div>

          {report.type === "FOUND" && (
            <div className="claim-section">
              <h2>Is this your item?</h2>

              <p>
                If you believe this found item belongs to you,
                you can submit an ownership claim.
              </p>

              <button
                onClick={() =>
                  navigate(`/claim/${report.item.id}`)
                }
              >
                Claim Ownership
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ReportDetails;