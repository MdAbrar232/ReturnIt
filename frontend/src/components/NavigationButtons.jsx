import { useNavigate } from "react-router-dom";
import "./NavigationButtons.css";

function NavigationButtons() {
  const navigate = useNavigate();

  return (
    <div className="navigation-buttons">
      <button
        type="button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <button
        type="button"
        onClick={() => navigate("/dashboard")}
      >
        🏠 Dashboard
      </button>
    </div>
  );
}

export default NavigationButtons;