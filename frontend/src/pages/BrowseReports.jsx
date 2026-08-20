import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseReports.css";

function BrowseReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  

  const fetchReports = async () => {
    const token = localStorage.getItem("token");

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (type) {
        params.append("type", type);
      }

      if (category) {
        params.append("category", category);
      }

      if (location) {
        params.append("location", location);
      }

      const query = params.toString();

      const response = await fetch(
        `http://127.0.0.1:8000/api/reports/browse/${
          query ? `?${query}` : ""
        }`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load reports.");
        return;
      }

      setReports(data);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };
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

    const categoryData = await categoryResponse.json();
    const locationData = await locationResponse.json();

    setCategories(categoryData);
    setLocations(locationData);

  } catch {
    console.log("Could not load filters");
  }
};

  useEffect(() => {
    fetchReports();
    fetchFilters();
    }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchReports();
  };

  return (
    <div className="browse-page">
      <div className="browse-container">
        <h1>Browse Reports</h1>

        <p className="browse-subtitle">
          Browse lost and found items reported by the university community.
        </p>

        <form
          className="browse-filters"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search item title..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
          >
            <option value="">All Types</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>

<select
  value={category}
  onChange={(event) =>
    setCategory(event.target.value)
  }
>
  <option value="">
    All Categories
  </option>

  {categories.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>          
          

          <select
  value={location}
  onChange={(event) =>
    setLocation(event.target.value)
  }
>
  <option value="">
    All Locations
  </option>

  {locations.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>

          <button type="submit">
            Search
          </button>
        </form>

        {loading && (
          <p className="browse-message">
            Loading reports...
          </p>
        )}

        {error && (
          <p className="browse-error">
            {error}
          </p>
        )}

        {!loading && !error && reports.length === 0 && (
          <p className="browse-message">
            No reports found.
          </p>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="reports-list">
            {reports.map((report) => (
              <div
                className="report-card"
                key={report.id}
              >
                <div className="report-header">
                  <h2>{report.item.title}</h2>

                  <span
                    className={`report-type ${report.type.toLowerCase()}`}
                  >
                    {report.type}
                  </span>
                </div>

                <p>
                  <strong>Description:</strong>{" "}
                  {report.item.description}
                </p>

                <p>
                  <strong>Brand:</strong>{" "}
                  {report.item.brand || "Not specified"}
                </p>

                <p>
                  <strong>Color:</strong>{" "}
                  {report.item.color || "Not specified"}
                </p>

                <p>
                  <strong>Condition:</strong>{" "}
                  {report.item.condition}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {report.item.category}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {report.location}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {report.report_date}
                </p>

                <button
                  onClick={() =>
                    navigate(`/report/${report.id}`)
                  }
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseReports;