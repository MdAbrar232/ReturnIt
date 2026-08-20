import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ReportForm.css";

function ReportForm() {

  const { reportId } = useParams();

  const isEditMode = Boolean(reportId);

  const [reportType, setReportType] = useState("LOST");
  const [description, setDescription] = useState("");
  const [reportDate, setReportDate] = useState("");

  const [title, setTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [condition, setCondition] = useState("GOOD");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {

    if (!isEditMode) {
      return;
    }

    const fetchReport = async () => {

      const token = localStorage.getItem("token");

      try {

        const response = await fetch(
          `http://127.0.0.1:8000/api/reports/${reportId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );


        const data = await response.json();


        if (!response.ok) {
          setError("Could not load report.");
          return;
        }


        setReportType(data.type);
        setDescription(data.description);
        setReportDate(data.report_date);

        setTitle(data.item.title);
        setItemDescription(data.item.description);
        setBrand(data.item.brand);
        setColor(data.item.color);
        setCondition(data.item.condition);


      } catch {

        setError("Could not connect to server.");

      }

    };


    fetchReport();

  }, [reportId, isEditMode]);



  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");


    const reportData = {

      description,
      report_date: reportDate,

      item: {

        title,
        description: itemDescription,
        brand,
        color,
        condition,

      }

    };


    try {


      let url;
      let method;


      if (isEditMode) {

        url =
        `http://127.0.0.1:8000/api/reports/${reportId}/manage/`;

        method = "PATCH";


      } else {


        url =
        "http://127.0.0.1:8000/api/reports/";

        method = "POST";


        reportData.type = reportType;

        reportData.location = 1;

        reportData.item.category = 1;

      }



      const response = await fetch(
        url,
        {
          method,

          headers: {

            "Content-Type": "application/json",

            Authorization:
            `Token ${token}`,

          },

          body: JSON.stringify(reportData),

        }
      );


      const data = await response.json();


      if (!response.ok) {

        setError(
          data.error ||
          "Operation failed."
        );

        return;

      }


      setSuccess(
        isEditMode
        ? "Report updated successfully."
        : "Report created successfully."
      );


    } catch {

      setError(
        "Could not connect to server."
      );

    }

  };



  return (

    <div className="report-page">

      <div className="report-card">


        <h1>
          {isEditMode
            ? "Edit Report"
            : "Create Report"}
        </h1>


        <p className="report-subtitle">

          {isEditMode
          ? "Update your lost or found item details"
          : "Report a lost or found item"}

        </p>



        <form onSubmit={handleSubmit}>


          {!isEditMode && (

            <>
            <label>Report Type</label>

            <select
              value={reportType}
              onChange={(event)=>
                setReportType(event.target.value)
              }
            >

              <option value="LOST">
                Lost Item
              </option>

              <option value="FOUND">
                Found Item
              </option>

            </select>

            </>

          )}



          <label>Item Name</label>

          <input

            value={title}

            onChange={(event)=>
              setTitle(event.target.value)
            }

            required

          />



          <label>Item Description</label>

          <textarea

            value={itemDescription}

            onChange={(event)=>
              setItemDescription(event.target.value)
            }

            required

          />



          <label>Brand</label>

          <input

            value={brand}

            onChange={(event)=>
              setBrand(event.target.value)
            }

          />



          <label>Color</label>

          <input

            value={color}

            onChange={(event)=>
              setColor(event.target.value)
            }

          />



          <label>Condition</label>

          <select

            value={condition}

            onChange={(event)=>
              setCondition(event.target.value)
            }

          >

            <option value="GOOD">
              Good
            </option>

            <option value="DAMAGED">
              Damaged
            </option>

            <option value="FAIR">
              Fair
            </option>


          </select>



          <label>
            Report Description
          </label>


          <textarea

            value={description}

            onChange={(event)=>
              setDescription(event.target.value)
            }

            required

          />



          <label>
            Report Date
          </label>


          <input

            type="date"

            value={reportDate}

            onChange={(event)=>
              setReportDate(event.target.value)
            }

            required

          />



          {error && (
            <p className="report-error">
              {error}
            </p>
          )}



          {success && (
            <p className="report-success">
              {success}
            </p>
          )}



          <button type="submit">

            {isEditMode
            ? "Update Report"
            : "Submit Report"}

          </button>


        </form>


      </div>

    </div>

  );

}


export default ReportForm;