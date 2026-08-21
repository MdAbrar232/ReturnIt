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

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchFilters = async () => {
      const token = localStorage.getItem("token");

      try {
        const categoryResponse = await fetch(
          "http://127.0.0.1:8000/api/reports/categories/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const locationResponse = await fetch(
          "http://127.0.0.1:8000/api/reports/locations/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const categoryData =
          await categoryResponse.json();

        const locationData =
          await locationResponse.json();

        if (!categoryResponse.ok) {
          setError("Could not load categories.");
          return;
        }

        if (!locationResponse.ok) {
          setError("Could not load locations.");
          return;
        }

        setCategories(categoryData);
        setLocations(locationData);
      } catch {
        setError(
          "Could not connect to the server."
        );
      }
    };

    fetchFilters();
  }, []);

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

        setCategory(
          String(data.item.category.id)
        );

        setLocation(
          String(data.location.id)
        );

        if (
          data.item.photos &&
          data.item.photos.length > 0
        ) {
          setCurrentImage(
            data.item.photos[0].image
          );
        }
      } catch {
        setError(
          "Could not connect to server."
        );
      }
    };

    fetchReport();
  }, [reportId, isEditMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!location) {
      setError("Please select a location.");
      return;
    }

    try {
      let response;

      if (isEditMode) {
        const reportData = {
          description,
          report_date: reportDate,
          location: Number(location),

          item: {
            title,
            description: itemDescription,
            brand,
            color,
            condition,
            category: Number(category),
          },
        };

        response = await fetch(
          `http://127.0.0.1:8000/api/reports/${reportId}/manage/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(reportData),
          }
        );
      } else {
        const formData = new FormData();

        formData.append("type", reportType);
        formData.append(
          "description",
          description
        );
        formData.append(
          "report_date",
          reportDate
        );
        formData.append(
          "location",
          location
        );

        formData.append(
          "item_title",
          title
        );
        formData.append(
          "item_description",
          itemDescription
        );
        formData.append(
          "item_brand",
          brand
        );
        formData.append(
          "item_color",
          color
        );
        formData.append(
          "item_condition",
          condition
        );
        formData.append(
          "item_category",
          category
        );

        if (image) {
          formData.append(
            "image",
            image
          );
        }

        response = await fetch(
          "http://127.0.0.1:8000/api/reports/",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
            },
            body: formData,
          }
        );
      }

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
              <label>
                Report Type
              </label>

              <select
                value={reportType}
                onChange={(event) =>
                  setReportType(
                    event.target.value
                  )
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

          <label>
            Item Name
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />

          <label>
            Item Description
          </label>

          <textarea
            value={itemDescription}
            onChange={(event) =>
              setItemDescription(
                event.target.value
              )
            }
            required
          />

          <label>
            Brand
          </label>

          <input
            value={brand}
            onChange={(event) =>
              setBrand(event.target.value)
            }
          />

          <label>
            Color
          </label>

          <input
            value={color}
            onChange={(event) =>
              setColor(event.target.value)
            }
          />

          <label>
            Condition
          </label>

          <select
            value={condition}
            onChange={(event) =>
              setCondition(
                event.target.value
              )
            }
          >
            <option value="NEW">
              New
            </option>

            <option value="GOOD">
              Good
            </option>

            <option value="FAIR">
              Fair
            </option>

            <option value="DAMAGED">
              Damaged
            </option>
          </select>

          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            required
          >
            <option value="">
              Select Category
            </option>

            {categories.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <label>
            Location
          </label>

          <select
            value={location}
            onChange={(event) =>
              setLocation(
                event.target.value
              )
            }
            required
          >
            <option value="">
              Select Location
            </option>

            {locations.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <label>
            Report Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            required
          />

          <label>
            Report Date
          </label>

          <input
            type="date"
            value={reportDate}
            onChange={(event) =>
              setReportDate(
                event.target.value
              )
            }
            required
          />

          <label>
            Item Image
          </label>

          {isEditMode &&
            currentImage && (
              <div className="current-image">
                <p>
                  Current Image:
                </p>

                <img
                  src={currentImage}
                  alt={title}
                />
              </div>
            )}

          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setImage(
                event.target.files[0] || null
              )
            }
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