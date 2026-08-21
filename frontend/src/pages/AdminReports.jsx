import { useEffect, useState } from "react";
import "./AdminReports.css";
import NavigationButtons from "../components/NavigationButtons";

function AdminReports() {

  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  const fetchReports = async () => {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/reports/admin/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );


      const data = await response.json();


      if (!response.ok) {

        setError(
          data.detail ||
          data.error ||
          "Could not load reports."
        );

        return;
      }


      setReports(data);


    } catch {

      setError(
        "Could not connect to server."
      );

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchReports();

  }, []);



  const updateStatus = async (
    reportId,
    status
  ) => {

    const token = localStorage.getItem("token");


    await fetch(
      `http://127.0.0.1:8000/api/reports/admin/${reportId}/status/`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },

        body: JSON.stringify({
          status,
        }),

      }
    );


    fetchReports();

  };



  const deleteReport = async (
    reportId
  ) => {


    const confirmDelete =
      window.confirm(
        "Delete this report?"
      );


    if (!confirmDelete) {
      return;
    }


    const token =
      localStorage.getItem("token");


    await fetch(
      `http://127.0.0.1:8000/api/reports/admin/${reportId}/`,
      {
        method: "DELETE",

        headers: {
          Authorization:
          `Token ${token}`,
        },
      }
    );


    fetchReports();

  };



  if (loading) {

    return <p>Loading reports...</p>;

  }



  return (

    <div className="admin-reports-page">

      <div className="admin-reports-container">

      <NavigationButtons />
      
        <h1>
          Manage Reports
        </h1>



        {error && (

          <p className="error">
            {error}
          </p>

        )}



        {reports.map((report) => (

          <div
            className="admin-report-card"
            key={report.id}
          >


            <h2>
              {report.item.title}
            </h2>


            <p>
              Type: {report.type}
            </p>


            <p>
              Owner: {report.owner}
            </p>


            <p>
              Location: {report.location}
            </p>


            <p>
              Status: {report.status}
            </p>


            <p>
              Category:
              {" "}
              {report.item.category}
            </p>



            <button
              onClick={() =>
                updateStatus(
                  report.id,
                  "RESOLVED"
                )
              }
            >
              Mark Resolved
            </button>



            <button
              onClick={() =>
                updateStatus(
                  report.id,
                  "CLOSED"
                )
              }
            >
              Close
            </button>



            <button
              onClick={() =>
                deleteReport(report.id)
              }
            >
              Delete
            </button>



          </div>

        ))}


      </div>

    </div>

  );

}


export default AdminReports;




