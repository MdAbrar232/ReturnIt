import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


function Login() {
  const [universityId, setUniversityId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            university_id: universityId,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");

      console.log("Login successful:", data.user);
    } catch {
      setError("Could not connect to the server.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome to ReturnIt</h1>

        <p className="login-subtitle">
          Sign in with your university account
        </p>

        <form onSubmit={handleSubmit}>
          <label>University ID</label>

          <input
            type="text"
            placeholder="Enter your university ID"
            value={universityId}
            onChange={(event) =>
              setUniversityId(event.target.value)
            }
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;