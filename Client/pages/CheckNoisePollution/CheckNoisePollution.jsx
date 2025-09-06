import React, { useEffect, useState } from "react";
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

// ✅ Real city coordinates
const cityCoords = {
  Bengaluru: [12.9716, 77.5946],
  Chennai: [13.0827, 80.2707],
  Delhi: [28.7041, 77.1025],
  Hyderabad: [17.385, 78.4867],
  Kolkata: [22.5726, 88.3639],
  Lucknow: [26.8467, 80.9462],
  Mumbai: [19.076, 72.8777],
};

// ✅ Color scale from green → yellow → red
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


function CheckNoisePollution() {
  const [data, setData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch noise data from backend
  useEffect(() => {
    // Use the Vite proxy to simplify the fetch URL
    fetch("/api/noise")
      .then((res) => res.json())
      .then((json) => {
        if (!Array.isArray(json)) {
          throw new Error("Received invalid data from the server.");
        }
        setData(json);

        // Get unique stations for dropdown
        // Using .trim() to handle potential whitespace issues in station names
        const uniqueStations = [...new Set(json.map((d) => d.Station.trim()))];
        setStations(uniqueStations);

        // Default selection
        if (uniqueStations.length > 0) {
          setSelectedStation(uniqueStations[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching noise data:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  // ✅ Filter by station
  useEffect(() => {
    if (selectedStation) {
      const newFilteredData = data.filter(
        (d) => d.Station.trim() === selectedStation
      );
      setFilteredData(newFilteredData);
    }
  }, [selectedStation, data]);

  if (loading) {
    return <div className="check-city-page"><LoadingSpinner /></div>;
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

  return (
    <>
      <Navbar />
      <div className="check-city-page">
        <h1 className="page-title">Noise Pollution Monitor</h1>

        {/* Map */}
        <div id="map" className="aqi-map">
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

            // Latest year’s value
            const latest = cityData[cityData.length - 1];
            const avgNoise = (latest.Day + latest.Night) / 2;

            return (
              <CircleMarker
                key={station}
                center={cityCoords[station]}
                radius={10}
                fillOpacity={0.8}
                fillColor={getColor(avgNoise)}
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

        {/* Controls Bar */}
        <div className="controls-bar">
          <div className="dropdowns">
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
            >
              {stations.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Noise Chart */}
        <div className="chart-container">
          <h2>Noise Levels (dB) - {selectedStation}</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
              <XAxis
                dataKey="Year"
                label={{ value: "Years", position: "insideBottom", offset: -5 }}
                tick={{ fill: '#e0e0e0' }}
              />
              <YAxis
                label={{
                  value: "Decibels (dB)",
                  angle: -90,
                  position: "insideLeft",
                  fill: '#e0e0e0'
                }}
                tick={{ fill: '#e0e0e0' }}
              />
              <ReTooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.8)', border: '1px solid #555' }} />
              <Legend />
              <Line type="monotone" dataKey="Day" stroke="#ffc107" name="Day dB" />
              <Line type="monotone" dataKey="Night" stroke="#03a9f4" name="Night dB" />
              <Line type="monotone" dataKey="DayLimit" stroke="#4caf50" name="Day Limit" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="NightLimit" stroke="#f44336" name="Night Limit" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default CheckNoisePollution;
