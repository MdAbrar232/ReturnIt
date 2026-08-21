import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Matches.css";
import NavigationButtons from "../components/NavigationButtons";

function Matches() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [strategy, setStrategy] = useState("strict");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem("token");

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/reports/${reportId}/matches/?strategy=${strategy}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.error || "Could not load matches."
          );
          setMatches([]);
          return;
        }

        setMatches(data);
      } catch {
        setError(
          "Could not connect to the server."
        );
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [reportId, strategy]);

  if (loading) {
    return <p>Loading matches...</p>;
  }

  return (
    <div className="matches-page">
      <div className="matches-container">
      <NavigationButtons />
        <h1>Potential Matches</h1>

        <p className="matches-subtitle">
          Possible found items matching your lost report
        </p>

        <div className="strategy-selector">
          <label htmlFor="strategy">
            Matching method:
          </label>

          <select
            id="strategy"
            value={strategy}
            onChange={(event) =>
              setStrategy(event.target.value)
            }
          >
            <option value="strict">
              Strict Matching
            </option>

            <option value="flexible">
              Flexible Matching
            </option>
          </select>
        </div>

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
            <div
              className="match-card"
              key={match.item_id}
            >

              <div className="match-header">
                <h2>{match.title}</h2>

                <span className="match-type">
                  Potential Match
                </span>
              </div>

              {match.photos &&
                match.photos.length > 0 && (
                  <div className="match-image-container">
                    <img
                      className="match-image"
                      src={match.photos[0].image}
                      alt={match.title}
                    />
                  </div>
                )}

              <p>
                <strong>Description:</strong>{" "}
                {match.description}
              </p>

              <p>
                <strong>Brand:</strong>{" "}
                {match.brand || "Not specified"}
              </p>

              <p>
                <strong>Color:</strong>{" "}
                {match.color || "Not specified"}
              </p>

              <p>
                <strong>Condition:</strong>{" "}
                {match.condition}
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/claim/${match.item_id}`
                  )
                }
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