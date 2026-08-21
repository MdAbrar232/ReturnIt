import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import logo from "../assets/North_South_University_Monogram.svg";


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

        setError(
          data.error || "Login failed."
        );

        return;

      }


      localStorage.setItem(
        "token",
        data.token
      );


      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      navigate("/dashboard");


    } catch {

      setError(
        "Could not connect to the server."
      );

    }

  };



  return (

    <div className="login-page">


      <div className="login-card">


        <img
          className="login-logo"
          src={logo}
          alt="NSU"
        />



        <h1>
          ReturnIt
        </h1>


        <p className="login-tagline">
          Campus Lost & Found
        </p>



        <p className="login-subtitle">

          Lost something on campus?
          <br />
          Find it back with your community.

        </p>




        <form onSubmit={handleSubmit}>


          <label>
            University ID
          </label>


          <input

            type="text"

            placeholder="Enter your university ID"

            value={universityId}

            onChange={(event) =>
              setUniversityId(
                event.target.value
              )
            }

          />



          <label>
            Password
          </label>


          <input

            type="password"

            placeholder="Enter your password"

            value={password}

            onChange={(event) =>
              setPassword(
                event.target.value
              )
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




        <p className="signup-link">

          Don't have an account?{" "}

          <button

            type="button"

            onClick={() =>
              navigate("/signup")
            }

          >

            Sign Up

          </button>


        </p>



      </div>


    </div>

  );

}


export default Login;