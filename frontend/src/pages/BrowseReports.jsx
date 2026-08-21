import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseReports.css";
import NavigationButtons from "../components/NavigationButtons";

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

      if (search.trim() !== "") {
        params.set("search", search.trim());
      }

      if (type !== "") {
        params.set("type", type);
      }

      if (category !== "") {
        params.set("category", category);
      }

      if (location !== "") {
        params.set("location", location);
      }

      const queryString = params.toString();

      let url =
        "http://127.0.0.1:8000/api/reports/browse/";

      if (queryString) {
        url += `?${queryString}`;
      }

      console.log("Browse Reports URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Could not load reports."
        );
        setReports([]);
        return;
      }

      setReports(data);
    } catch {
      setError("Could not connect to the server.");
      setReports([]);
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

      const categoryData =
        await categoryResponse.json();

      const locationData =
        await locationResponse.json();

      if (categoryResponse.ok) {
        setCategories(categoryData);
      }

      if (locationResponse.ok) {
        setLocations(locationData);
      }
    } catch {
      console.log("Could not load filters.");
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

  const handleClearFilters = () => {
    setSearch("");
    setType("");
    setCategory("");
    setLocation("");

    fetchReports();
  };

  return (
    <div className="browse-page">
      <div className="browse-container">
      <NavigationButtons />
        <h1>Browse Reports</h1>

        <p className="browse-subtitle">
          Browse lost and found items reported by
          the university community.
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
            <option value="">
              All Types
            </option>

            <option value="LOST">
              Lost
            </option>

            <option value="FOUND">
              Found
            </option>
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
              <option
                key={item.id}
                value={item.id}
              >
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
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <button type="submit">
            Search
          </button>

          <button
            type="button"
            onClick={handleClearFilters}
          >
            Clear
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

        {!loading &&
          !error &&
          reports.length === 0 && (
            <p className="browse-message">
              No reports found.
            </p>
          )}

        {!loading &&
          !error &&
          reports.length > 0 && (
            <div className="reports-list">

              {reports.map((report) => (
                <div
                  className="report-card"
                  key={report.id}
                >

                  <div className="report-header">

                    <h2>
                      {report.item.title}
                    </h2>

                    <span
                      className={`report-type ${report.type.toLowerCase()}`}
                    >
                      {report.type}
                    </span>

                  </div>

                  {report.item.photos &&
                    report.item.photos.length > 0 && (
                      <div className="report-image-container">

                        <img
                          className="report-image"
                          src={
                            report.item.photos[0].image
                          }
                          alt={
                            report.item.title
                          }
                        />

                      </div>
                    )}

                  <p>
                    <strong>
                      Description:
                    </strong>{" "}
                    {report.item.description}
                  </p>

                  <p>
                    <strong>
                      Brand:
                    </strong>{" "}
                    {report.item.brand ||
                      "Not specified"}
                  </p>

                  <p>
                    <strong>
                      Color:
                    </strong>{" "}
                    {report.item.color ||
                      "Not specified"}
                  </p>

                  <p>
                    <strong>
                      Condition:
                    </strong>{" "}
                    {report.item.condition}
                  </p>

                  <p>
                    <strong>
                      Category:
                    </strong>{" "}
                    {report.item.category}
                  </p>

                  <p>
                    <strong>
                      Location:
                    </strong>{" "}
                    {report.location}
                  </p>

                  <p>
                    <strong>
                      Date:
                    </strong>{" "}
                    {report.report_date}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/report/${report.id}`
                      )
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