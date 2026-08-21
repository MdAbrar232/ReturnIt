import { useEffect, useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import "./Notifications.css";


function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const fetchNotifications = async () => {

      const token = localStorage.getItem("token");


      try {

        const response = await fetch(
          "http://127.0.0.1:8000/api/notifications/",
          {
            headers:{
              Authorization:`Token ${token}`,
            },
          }
        );


        const data = await response.json();


        if(!response.ok){

          setError(
            data.error ||
            "Could not load notifications."
          );

          return;

        }


        setNotifications(data);


      } catch {

        setError(
          "Could not connect to the server."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchNotifications();


  },[]);



  if(loading){

    return (

      <div className="notifications-page">

        <div className="notifications-container">

          <p>
            Loading notifications...
          </p>

        </div>

      </div>

    );

  }



  return (

    <div className="notifications-page">


      <div className="notifications-container">


        <NavigationButtons />


        <h1>
          Notifications
        </h1>


        <p className="notifications-subtitle">

          Stay updated about your reports and claims.

        </p>



        {error && (

          <p className="notifications-error">
            {error}
          </p>

        )}




        {!error && notifications.length === 0 && (

          <div className="empty-notifications">

            🔔

            <p>
              No notifications yet.
            </p>

          </div>

        )}





        <div className="notifications-list">


          {notifications.map((notification)=>(


            <div
              className="notification-card"
              key={notification.id}
            >


              <div className="notification-icon">
                🔔
              </div>



              <div className="notification-content">


                <p>
                  {notification.message}
                </p>


                <small>

                  {new Date(
                    notification.created_at
                  ).toLocaleString()}

                </small>


              </div>


            </div>


          ))}


        </div>



      </div>


    </div>

  );

}


export default Notifications;