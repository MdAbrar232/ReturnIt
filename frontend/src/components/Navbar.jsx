import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

import logo from "../assets/North_South_University_Monogram.svg";


function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();


  const user = JSON.parse(
    localStorage.getItem("user")
  );


  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };



  const active = (path) => {

    return location.pathname === path
      ? "active"
      : "";

  };



  return (

    <nav className="navbar">


      <div
        className="navbar-brand"
        onClick={() => navigate("/dashboard")}
      >

        <img
          src={logo}
          alt="NSU"
        />


        <div>

          <h2>
            ReturnIt
          </h2>

          <span>
            Campus Lost & Found
          </span>

        </div>


      </div>




      <div className="navbar-links">


        <Link
          className={active("/dashboard")}
          to="/dashboard"
        >
          Dashboard
        </Link>


        <Link
          className={active("/browse")}
          to="/browse"
        >
          Browse
        </Link>


        <Link
          className={active("/reports")}
          to="/reports"
        >
          Reports
        </Link>


        <Link
          className={active("/claims")}
          to="/claims"
        >
          Claims
        </Link>


        <Link
          className={active("/notifications")}
          to="/notifications"
        >
          🔔
        </Link>



        {
          user?.role === "ADMIN" &&

          <Link
            className={active("/admin/reports")}
            to="/admin/reports"
          >
            Admin
          </Link>
        }



        <button
          onClick={logout}
        >
          Logout
        </button>


      </div>


    </nav>

  );

}


export default Navbar;