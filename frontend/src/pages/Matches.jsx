import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Matches.css";

function Matches() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/reports/${reportId}/matches/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not load matches.");
          return;
        }

        setMatches(data);
      } catch {
        setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [reportId]);

  if (loading) {
    return <p>Loading matches...</p>;
  }

  return (
    <div className="matches-page">
      <div className="matches-container">
        <h1>Potential Matches</h1>

        <p className="matches-subtitle">
          Possible found items matching your lost report
        </p>

        {error && (
          <p className="matches-error">
            {error}
          </p>
        )}

        {!error && matches.length === 0 && (
          <p className="no-matches">
            No potential matches found.
          </p>
        )}

        <div className="matches-list">
          {matches.map((match) => (
            <div className="match-card" key={match.item_id}>
              <div className="match-header">
                <h2>{match.title}</h2>

                <span className="match-score">
                  {Math.round(match.score)}% match
                </span>
              </div>

              <p>
                <strong>Description:</strong>{" "}
                {match.description}
              </p>

              <p>
                <strong>Brand:</strong>{" "}
                {match.brand}
              </p>

              <p>
                <strong>Color:</strong>{" "}
                {match.color}
              </p>

              <p>
                <strong>Condition:</strong>{" "}
                {match.condition}
              </p>
              <button
                onClick={() => navigate(`/claim/${match.item_id}`)}
              >
               Claim Ownership
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Matches;