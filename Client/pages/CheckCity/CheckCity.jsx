import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../components/NavBar/Navbar.jsx";
import "./CheckCity.css";

function CheckCity() {
  const [country, setCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [cityUid, setCityUid] = useState("");
  const [aqiData, setAqiData] = useState(null);
  const [pointerPosition, setPointerPosition] = useState(0);

  const mapRef = useRef(null);
  const detailsRef = useRef(null); // for auto-scroll

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([20, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);

      // AQI overlay
      L.tileLayer(
        `https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=${
          import.meta.env.VITE_AQI_TOKEN
        }`,
        {
          attribution:
            'Air Quality data © <a href="https://waqi.info/">waqi.info</a>',
        }
      ).addTo(mapRef.current);
    }
  }, []);

  // Update pointer position when AQI data changes
  useEffect(() => {
    if (aqiData && aqiData.aqi) {
      // Cap AQI at a reasonable max for the scale (e.g., 350)
      const maxAqiForScale = 350;
      const aqi = Math.min(parseInt(aqiData.aqi, 10), maxAqiForScale);
      const position = (aqi / maxAqiForScale) * 100;
      setPointerPosition(position);
    }
  }, [aqiData]);

  // Fetch list of stations for a country
  // Fetch list of stations for a country
  // Fetch list of stations for a country
  const fetchCities = async (countryName) => {
    try {
      const response = await fetch(`/api/countries/${countryName}`);
      const data = await response.json();
      const uniqueCities = {};
      (data.cities || []).forEach((c) => {
        const parts = c.name.split(",").map((p) => p.trim());
        const cityState =
          parts.length >= 2 ? `${parts[0]}, ${parts[1]}` : parts[0];
        if (!uniqueCities[cityState]) {
          uniqueCities[cityState] = { uid: c.uid, name: cityState };
        }
      });
      setCities(Object.values(uniqueCities));
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const fetchCityData = async (uid) => {
    try {
      const response = await fetch(`/api/station/${uid}`);
      const data = await response.json();
      setAqiData(data);

      // Auto scroll to details when data loads
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      console.error("Error fetching AQI:", err);
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setCities([]);
    setCityUid("");
    setAqiData(null);

    if (selectedCountry) {
      fetchCities(selectedCountry);
    }
  };

  const handleCityChange = (e) => {
    const uid = e.target.value;
    setCityUid(uid);
    if (uid) {
      fetchCityData(uid);
    }
  };

  return (
    <>
      <Navbar />
      <div className="check-city-page">
        <h1 className="page-title">Global Air Quality Monitor</h1>
        
        <div className="controls-bar">
          {/* Dropdowns */}
          <div className="dropdowns">
            <select value={country} onChange={handleCountryChange}>
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="China">China</option>
            </select>

            <select
              value={cityUid}
              onChange={handleCityChange}
              disabled={!cities.length}
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.uid} value={c.uid}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ AQI World Heatmap */}
        <div id="map" className="aqi-map"></div>

        {/* ✅ AQI Legend Heatmap */}
        <div className="aqi-legend">
          <h3>AQI Heatmap Scale</h3>
          <div className="aqi-gradient-container">
            <div className="aqi-gradient"></div>
            {aqiData && (
              <div className="aqi-pointer" style={{ left: `${pointerPosition}%` }}>
                <div className="aqi-pointer-value">{aqiData.aqi}</div>
              </div>
            )}
          </div>
          <div className="aqi-labels">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200</span>
            <span>300+</span>
          </div>
        </div>

        {/* City AQI Card */}
        {aqiData && (
          <div ref={detailsRef} className="aqi-card">
            <h2>{aqiData.city.name}</h2>
            <p className="aqi-value-line">
              <strong>AQI:</strong> {aqiData.aqi}
              <span className={`aqi-indicator level-${getAQILevel(aqiData.aqi)}`}></span>
              <span className="aqi-message">({getAQIMessage(aqiData.aqi)})</span>
            </p>
            <p>
              <strong>Dominant Pollutant:</strong> {aqiData.dominentpol}
            </p>
            <p>
              <strong>Last Updated:</strong> {aqiData.time.s}
            </p>
            <p className="advice">{getAQIAdvice(aqiData.aqi)}</p>
          </div>
        )}

        {/* AQI Chart */}
        {aqiData && aqiData.forecast?.daily?.pm25 && (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={aqiData.forecast.daily.pm25}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="min" stroke="#8884d8" />
                <Line type="monotone" dataKey="avg" stroke="#82ca9d" />
                <Line type="monotone" dataKey="max" stroke="#ff4d4f" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  );
}

// Helpers
function getAQILevel(aqi) {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "sensitive";
  if (aqi <= 200) return "unhealthy";
  if (aqi <= 300) return "very-unhealthy";
  return "hazardous";
}
function getAQIMessage(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}
function getAQIAdvice(aqi) {
  if (aqi <= 50) return "✅ Safe to go outside.";
  if (aqi <= 100) return "🙂 Acceptable air quality.";
  if (aqi <= 150) return "⚠️ Sensitive groups reduce outdoor exertion.";
  if (aqi <= 200) return "❌ Limit outdoor activity.";
  if (aqi <= 300) return "🚨 Health alert: Avoid outdoor activities.";
  return "☠️ Stay indoors.";
}

export default CheckCity;
