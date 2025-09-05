import { useState, useEffect } from "react";
import api from "../../api";
import "./CheckCity.css";

export default function CheckCity() {
  const [city, setCity] = useState("delhi");
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get(`/api/city/${city}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [city]);

  return (
    <div className="checkcity-container">
      <h1 className="checkcity-title">Check City AQI</h1>

      {/* Dropdown for city selection */}
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="city-select"
      >
        <option value="delhi">Delhi</option>
        <option value="mumbai">Mumbai</option>
      </select>

      {/* Show results */}
      {data ? (
        <div className="stats-box">
          <p>
            <b>City:</b> {data.city.toUpperCase()}
          </p>
          <p>
            <b>Latest AQI:</b> {data.latestAQI}
          </p>
          <p>
            <b>Average AQI:</b> {data.avg}
          </p>
          <p>
            <b>Min AQI:</b> {data.min}
          </p>
          <p>
            <b>Max AQI:</b> {data.max}
          </p>

          <h2 style={{ marginTop: "1rem", fontWeight: "600" }}>Series Data:</h2>
          <ul className="series-list">
            {data.series.map((item, index) => (
              <li key={index}>
                {item.date}: {item.aqi}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ marginTop: "1rem" }}>Loading...</p>
      )}
    </div>
  );
}
