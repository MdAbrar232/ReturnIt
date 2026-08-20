import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );


  const handleLogout = async () => {

    const token = localStorage.getItem("token");

    try {

      await fetch(
        "http://127.0.0.1:8000/api/auth/logout/",
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

    } catch {

      // Ignore logout error

    } finally {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");

    }

  };



  return (

    <div className="dashboard">

      <h1>
        Welcome to ReturnIt
      </h1>


      <p>
        Welcome, {user?.username || user?.university_id}.
      </p>



      <div className="dashboard-actions">


        <button
          onClick={() =>
            navigate("/report")
          }
        >
          Report Lost / Found Item
        </button>



        <button
          onClick={() =>
            navigate("/reports")
          }
        >
          View My Reports
        </button>



        <button
          onClick={() =>
            navigate("/browse")
          }
        >
          Browse Reports
        </button>



        <button>
          Notifications
        </button>



        {user?.role === "ADMIN" && (

          <>

            <button
              onClick={() =>
                navigate("/admin/claims")
              }
            >
              Manage Claims
            </button>


            <button
              onClick={() =>
                navigate("/admin/reports")
              }
            >
              Manage Reports
            </button>

          </>

        )}



        <button
          onClick={handleLogout}
        >
          Logout
        </button>


      </div>


    </div>

  );

}


export default Dashboard;