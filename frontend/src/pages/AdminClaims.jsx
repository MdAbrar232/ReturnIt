import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminClaims.css";
import NavigationButtons from "../components/NavigationButtons";

function AdminClaims() {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/claims/admin/",
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

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleDecision = async (claimId, action) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/claims/admin/${claimId}/${action}/`,
        {
          method: "PATCH",
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
            "Could not update claim."
        );
        return;
      }

      setClaims((currentClaims) =>
        currentClaims.map((claim) =>
          claim.id === claimId
            ? data
            : claim
        )
      );
    } catch {
      setError("Could not connect to the server.");
    }
  };

  if (loading) {
    return (
      <div className="admin-claims-page">
        <div className="admin-claims-container">
          <p>Loading claims...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-claims-page">
      <div className="admin-claims-container">
        <NavigationButtons />
        <h1>Manage Claims</h1>

        <p className="admin-claims-subtitle">
          Review ownership claims submitted by users.
        </p>

        {error && (
          <p className="admin-claims-error">
            {error}
          </p>
        )}

        {claims.length === 0 && !error && (
          <p className="no-admin-claims">
            No claims found.
          </p>
        )}

        <div className="admin-claims-list">
          {claims.map((claim) => (
            <div
              className="admin-claim-card"
              key={claim.id}
            >
              <div className="admin-claim-header">
                <h2>Claim #{claim.id}</h2>

                <span
                  className={`admin-claim-status ${claim.status.toLowerCase()}`}
                >
                  {claim.status}
                </span>
              </div>

              <p>
                <strong>Claimant:</strong>{" "}
                {claim.claimant}
              </p>

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

              {claim.status === "PENDING" && (
                <div className="admin-claim-actions">
                  <button
                    className="approve-button"
                    onClick={() =>
                      handleDecision(
                        claim.id,
                        "approve"
                      )
                    }
                  >
                    Approve
                  </button>

                  <button
                    className="reject-button"
                    onClick={() =>
                      handleDecision(
                        claim.id,
                        "reject"
                      )
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

       
      </div>
    </div>
  );
}

export default AdminClaims;