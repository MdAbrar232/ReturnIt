import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyClaims.css";
import NavigationButtons from "../components/NavigationButtons";

function MyClaims() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/claims/my/",
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
              "Could not load claims."
          );
          return;
        }

        setClaims(data);
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) {
    return (
      <div className="claims-page">
        <div className="claims-container">
          
          <p>Loading claims...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="claims-page">
      <div className="claims-container">
        <NavigationButtons />
        <h1>My Claims</h1>

        <p className="claims-subtitle">
          Claims you have submitted
        </p>

        {error && (
          <p className="claims-error">
            {error}
          </p>
        )}

        {!error && claims.length > 0 && (
          <div className="claims-list">
            {claims.map((claim) => (
              <div
                className="claim-card"
                key={claim.id}
              >
                <div className="claim-header">
                  <h2>
                    Claim #{claim.id}
                  </h2>

                  <span
                    className={`claim-status ${claim.status.toLowerCase()}`}
                  >
                    {claim.status}
                  </span>
                </div>

                <p>
                  <strong>Item ID:</strong>{" "}
                  {claim.item}
                </p>

                <p>
                  <strong>Proof:</strong>{" "}
                  {claim.proof}
                </p>

                {claim.remarks && (
                  <p>
                    <strong>Remarks:</strong>{" "}
                    {claim.remarks}
                  </p>
                )}

                <button
                  onClick={() =>
                    navigate(`/claims/${claim.id}`)
                  }
                >
                  View Claim
                </button>
              </div>
            ))}
          </div>
        )}

        {!error && claims.length === 0 && (
          <p className="no-claims">
            You haven't submitted any claims yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyClaims;