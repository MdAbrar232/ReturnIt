import { useState } from "react";
import "./ReportForm.css";

function ReportForm() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    const reportData = {
      type: reportType,
      description: description,
      report_date: reportDate,
      location: 1,
      item: {
        title: title,
        description: itemDescription,
        brand: brand,
        color: color,
        condition: condition,
        category: 1,
      },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/reports/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(reportData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not create report.");
        return;
      }

      setSuccess("Report created successfully.");

      console.log("Created report:", data);

    } catch {
      setError("Could not connect to the server.");
    }
  };

  return (
    <div className="report-page">
      <div className="report-card">
        <h1>Create Report</h1>

        <p className="report-subtitle">
          Report a lost or found item
        </p>

        <form onSubmit={handleSubmit}>

          <label>Report Type</label>

          <select
            value={reportType}
            onChange={(event) =>
              setReportType(event.target.value)
            }
          >
            <option value="LOST">Lost Item</option>
            <option value="FOUND">Found Item</option>
          </select>

          <label>Item Name</label>

          <input
            type="text"
            placeholder="e.g. Black Samsung Phone"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />

          <label>Item Description</label>

          <textarea
            placeholder="Describe the item"
            value={itemDescription}
            onChange={(event) =>
              setItemDescription(event.target.value)
            }
            required
          />

          <label>Brand</label>

          <input
            type="text"
            placeholder="e.g. Samsung"
            value={brand}
            onChange={(event) =>
              setBrand(event.target.value)
            }
            required
          />

          <label>Color</label>

          <input
            type="text"
            placeholder="e.g. Black"
            value={color}
            onChange={(event) =>
              setColor(event.target.value)
            }
            required
          />

          <label>Condition</label>

          <select
            value={condition}
            onChange={(event) =>
              setCondition(event.target.value)
            }
          >
            <option value="GOOD">Good</option>
            <option value="DAMAGED">Damaged</option>
            <option value="POOR">Poor</option>
          </select>

          <label>Report Description</label>

          <textarea
            placeholder="Where did you lose/find it? Add any additional details."
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            required
          />

          <label>Report Date</label>

          <input
            type="date"
            value={reportDate}
            onChange={(event) =>
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
            Submit Report
          </button>

        </form>
      </div>
    </div>
  );
}

export default ReportForm;