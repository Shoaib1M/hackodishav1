// CheckNoisePollution.jsx
import React, { useEffect, useState, useRef } from "react";
import "./CheckNoisePollution.css";
import Navbar from "../../components/NavBar/Navbar.jsx";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const cityCoords = {
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Delhi: [28.7041, 77.1025],
  Hyderabad: [17.385, 78.4867],
  Kolkata: [22.5726, 88.3639],
  Lucknow: [26.8467, 80.9462],
  Mumbai: [19.076, 72.8777],
};

function getColor(value) {
  if (value < 60) return "green";
  if (value < 70) return "orange";
  return "red";
}

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading Noise Data...</p>
  </div>
);

function getPrecautions(noiseLevel) {
  if (noiseLevel < 60) {
    return [
      "Enjoy the safe environment! Noise levels are within healthy limits.",
      "Continue practicing good habits like avoiding unnecessary honking.",
    ];
  } else if (noiseLevel < 70) {
    return [
      "Noise levels are slightly above safe limits.",
      "Use noise-cancelling headphones if you feel disturbed.",
      "Limit your time in high-traffic or noisy areas.",
      "Encourage quieter practices in your community.",
    ];
  } else {
    return [
      "⚠️ Noise levels are high and may harm your health.",
      "Avoid staying in noisy areas for long periods.",
      "Keep windows and doors closed to block outside noise.",
      "Use earplugs or noise-cancelling headphones when needed.",
      "Encourage local authorities to enforce noise regulations.",
    ];
  }
}

function CheckNoisePollution() {
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resultsRef = useRef(null);

  useEffect(() => {
    fetch("/api/noise")
      .then((res) => res.json())
      .then((json) => {
        if (!Array.isArray(json)) {
          throw new Error("Received invalid data from the server.");
        }
        setData(json);

        const uniqueStations = [...new Set(json.map((d) => d.Station.trim()))];
        setStations(uniqueStations);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching noise data:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedStation) {
      const newFilteredData = data.filter(
        (d) => d.Station.trim() === selectedStation
      );
      setFilteredData(newFilteredData);

      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [selectedStation, data]);

  if (loading) {
    return (
      <div className="check-city-page">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="check-city-page error-page">
          <div className="aqi-card">
            <h2>Error Loading Data</h2>
            <p>
              Could not fetch noise pollution data. Please ensure the server is
              running and try again.
            </p>
            <pre style={{ color: "#ff8a8a" }}>{error.message}</pre>
          </div>
        </div>
      </>
    );
  }

  const latestEntry = filteredData[filteredData.length - 1];
  const avgNoise = latestEntry
    ? (latestEntry.Day + latestEntry.Night) / 2
    : null;
  const precautions = avgNoise ? getPrecautions(avgNoise) : [];

  return (
    <>
      <Navbar />
      <div className="check-city-page noise-pollution-page">
        <h1 className="page-title">Noise Pollution Monitor</h1>

        {/* Dropdown below h1 */}
        <div className="dropdown-container">
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
          >
            <option value="">-- Select a city --</option>
            {stations.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        {/* Map */}
        <div id="map" className="map-container">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="leaflet-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {stations.map((station) => {
              const cityData = data.filter((d) => d.Station.trim() === station);
              if (!cityData.length || !cityCoords[station]) return null;

              const latest = cityData[cityData.length - 1];
              const avgNoiseCity = (latest.Day + latest.Night) / 2;

              return (
                <CircleMarker
                  key={station}
                  center={cityCoords[station]}
                  radius={10}
                  fillOpacity={0.8}
                  fillColor={getColor(avgNoiseCity)}
                  stroke={false}
                >
                  <Tooltip>
                    <div>
                      <b>{station}</b>
                      <br />
                      Year: {latest.Year}
                      <br />
                      Day: {latest.Day} dB
                      <br />
                      Night: {latest.Night} dB
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Results */}
        {selectedStation && (
          <div ref={resultsRef} className="results-section">
            <h2>Noise Levels (dB) - {selectedStation}</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.2)"
                />
                <XAxis dataKey="Year" tick={{ fill: "#e0e0e0" }} />
                <YAxis
                  label={{
                    value: "Decibels (dB)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#e0e0e0",
                  }}
                  tick={{ fill: "#e0e0e0" }}
                />
                <ReTooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 30, 30, 0.8)",
                    border: "1px solid #555",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Day"
                  stroke="#ffc107"
                  name="Day dB"
                />
                <Line
                  type="monotone"
                  dataKey="Night"
                  stroke="#03a9f4"
                  name="Night dB"
                />
                <Line
                  type="monotone"
                  dataKey="DayLimit"
                  stroke="#4caf50"
                  name="Day Limit"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="NightLimit"
                  stroke="#f44336"
                  name="Night Limit"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>

            {avgNoise && (
              <div className="precautions">
                <h2>Precautionary Steps</h2>
                <p>
                  Based on the current average noise level of{" "}
                  <b>{avgNoise.toFixed(1)} dB</b> at <b>{selectedStation}</b>:
                </p>
                <ol>
                  {precautions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default CheckNoisePollution;
