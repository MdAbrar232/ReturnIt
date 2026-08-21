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
          method:"POST",
          headers:{
            Authorization:`Token ${token}`,
          },
        }
      );


    } catch {

    }
    finally {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");

    }

  };



  return (

    <div className="dashboard">


      <section className="dashboard-hero">


        <h1>
          Welcome back, {user?.username || user?.university_id} 👋
        </h1>


        <p>
          Find lost belongings, report items,
          and reconnect with your NSU community.
        </p>


        <button
          className="primary-action"
          onClick={() => navigate("/report")}
        >

          + Report Lost / Found Item

        </button>


      </section>




      <section className="dashboard-section">


        <h2>
          Quick Actions
        </h2>



        <div className="dashboard-grid">


          <div
            className="dashboard-card"
            onClick={() => navigate("/browse")}
          >

            <span>
              🔍
            </span>

            <h3>
              Browse Reports
            </h3>

            <p>
              Search lost and found items.
            </p>

          </div>




          <div
            className="dashboard-card"
            onClick={() => navigate("/reports")}
          >

            <span>
              📄
            </span>

            <h3>
              My Reports
            </h3>

            <p>
              Manage your submitted reports.
            </p>

          </div>




          <div
            className="dashboard-card"
            onClick={() => navigate("/claims")}
          >

            <span>
              📦
            </span>

            <h3>
              My Claims
            </h3>

            <p>
              Track ownership requests.
            </p>

          </div>




          <div
            className="dashboard-card"
            onClick={() => navigate("/notifications")}
          >

            <span>
              🔔
            </span>

            <h3>
              Notifications
            </h3>

            <p>
              View updates and alerts.
            </p>

          </div>



        </div>


      </section>





      {
        user?.role === "ADMIN" &&

        <section className="admin-section">


          <h2>
            Admin Panel
          </h2>


          <div className="dashboard-grid">


            <div
              className="dashboard-card admin"
              onClick={() => navigate("/admin/reports")}
            >

              <span>
                🗂️
              </span>

              <h3>
                Manage Reports
              </h3>

            </div>



            <div
              className="dashboard-card admin"
              onClick={() => navigate("/admin/claims")}
            >

              <span>
                ✅
              </span>

              <h3>
                Manage Claims
              </h3>

            </div>



            <div
              className="dashboard-card admin"
              onClick={() => navigate("/admin/logs")}
            >

              <span>
                📊
              </span>

              <h3>
                Activity Logs
              </h3>

            </div>


          </div>


        </section>

      }



      <button
        className="logout-button"
        onClick={handleLogout}
      >

        Logout

      </button>



    </div>

  );

}


export default Dashboard;