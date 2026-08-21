import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ClaimForm.css";
import NavigationButtons from "../components/NavigationButtons";

function ClaimForm() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [proof, setProof] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/claims/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            item: Number(itemId),
            proof,
            remarks,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            data.error ||
            "Could not submit claim."
        );
        return;
      }

      navigate(`/claims/${data.id}`);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="claim-form-page">
      <div className="claim-form-container">
        <NavigationButtons />
        <h1>Claim Ownership</h1>

        <p className="claim-form-subtitle">
          Provide evidence that this item belongs to you.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="proof">
            Proof of Ownership
          </label>

          <textarea
            id="proof"
            value={proof}
            onChange={(event) =>
              setProof(event.target.value)
            }
            placeholder="Explain how you can prove that this item belongs to you..."
            required
          />

          <label htmlFor="remarks">
            Additional Remarks
          </label>

          <textarea
            id="remarks"
            value={remarks}
            onChange={(event) =>
              setRemarks(event.target.value)
            }
            placeholder="Add any additional information..."
          />

          {error && (
            <p className="claim-form-error">
              {error}
            </p>
          )}

          <div className="claim-form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClaimForm;