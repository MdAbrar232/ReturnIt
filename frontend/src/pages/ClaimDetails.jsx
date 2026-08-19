import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ClaimDetails.css";

function ClaimDetails() {
  const { claimId } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchClaim = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/claims/${claimId}/`,
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
              "Could not load claim."
          );
          return;
        }

        setClaim(data);
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [claimId]);

  const handleCancel = async () => {
    const token = localStorage.getItem("token");

    setCancelling(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/claims/${claimId}/cancel/`,
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
            "Could not cancel claim."
        );
        return;
      }

      setClaim(data);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="claim-details-page">
        <div className="claim-details-container">
          <p>Loading claim...</p>
        </div>
      </div>
    );
  }

  if (error && !claim) {
    return (
      <div className="claim-details-page">
        <div className="claim-details-container">
          <p className="claim-details-error">
            {error}
          </p>

          <button onClick={() => navigate("/claims")}>
            Back to My Claims
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="claim-details-page">
      <div className="claim-details-container">
        <div className="claim-details-header">
          <h1>Claim #{claim.id}</h1>

          <span
            className={`claim-details-status ${claim.status.toLowerCase()}`}
          >
            {claim.status}
          </span>
        </div>

        <div className="claim-details-section">
          <h2>Item</h2>

          <p>
            <strong>Item ID:</strong>{" "}
            {claim.item}
          </p>
        </div>

        <div className="claim-details-section">
          <h2>Proof of Ownership</h2>

          <p>{claim.proof}</p>
        </div>

        {claim.remarks && (
          <div className="claim-details-section">
            <h2>Additional Remarks</h2>

            <p>{claim.remarks}</p>
          </div>
        )}

        <div className="claim-details-section">
          <h2>Claim Information</h2>

          <p>
            <strong>Submitted:</strong>{" "}
            {new Date(
              claim.created_at
            ).toLocaleString()}
          </p>

          <p>
            <strong>Last Updated:</strong>{" "}
            {new Date(
              claim.updated_at
            ).toLocaleString()}
          </p>
        </div>

        {error && (
          <p className="claim-details-error">
            {error}
          </p>
        )}

        <div className="claim-details-actions">
          <button
            onClick={() => navigate("/claims")}
          >
            Back to My Claims
          </button>

          {claim.status === "PENDING" && (
            <button
              className="cancel-claim-button"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Claim"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClaimDetails;