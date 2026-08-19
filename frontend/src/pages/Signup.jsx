import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    university_id: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const firstError = Object.values(data)[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : firstError || "Signup failed."
        );

        return;
      }

      setSuccess("Account created successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch {
      setError("Could not connect to the server.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Join ReturnIt</h1>

        <p className="signup-subtitle">
          Create your university account
        </p>

        <form onSubmit={handleSubmit}>
          <label>University Email</label>

          <input
            type="email"
            name="email"
            placeholder="yourname@northsouth.edu"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>University ID</label>

          <input
            type="text"
            name="university_id"
            placeholder="Enter your university ID"
            value={formData.university_id}
            onChange={handleChange}
            required
          />

          <label>Username</label>

          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>

          <input
            type="password"
            name="password_confirm"
            placeholder="Confirm your password"
            value={formData.password_confirm}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="signup-error">
              {error}
            </p>
          )}

          {success && (
            <p className="signup-success">
              {success}
            </p>
          )}

          <button type="submit">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;