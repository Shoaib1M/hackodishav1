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
  const [showDesc, setShowDesc] = useState(false); // 👈 NEW

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

  // Recalculate Leaflet size after layout and on window resize
  useEffect(() => {
    const resize = () => {
      if (mapRef.current) mapRef.current.invalidateSize();
    };
    const t = setTimeout(resize, 0);
    window.addEventListener("resize", resize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Update pointer position when AQI data changes
  useEffect(() => {
    if (aqiData && aqiData.aqi) {
      const maxAqiForScale = 350;
      const aqi = Math.min(parseInt(aqiData.aqi, 10), maxAqiForScale);
      const position = (aqi / maxAqiForScale) * 100;
      setPointerPosition(position);
    }
  }, [aqiData]);

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
        <header className="page-header">
          <h1 className="page-title">Global Air Quality Monitor</h1>

          {/* 👇 Description Toggle */}
          <button className="desc-btn" onClick={() => setShowDesc(!showDesc)}>
            {showDesc ? "Hide Description" : "Show Description"}
          </button>

          {showDesc && (
            <div className="desc-box">
              <h3>About this page</h3>
              <p>
                <strong>Why:</strong> This page helps users monitor real-time
                air quality across countries and cities using live AQI data.
              </p>
              <p>
                <strong>How:</strong> Select a country, then pick a city to see
                its AQI readings, forecast trends, and precautionary health
                advice.
              </p>
              <p>
                <strong>Summary:</strong> Offers interactive maps, charts, and
                safety recommendations to raise awareness of air pollution and
                its effects.
              </p>
            </div>
          )}
        </header>

        {/* Dropdowns */}
        <div className="controls-bar">
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

        {/* 🌍 AQI World Heatmap */}
        <div id="map" className="aqi-map"></div>

        {/* 📊 AQI Legend */}
        <div className="aqi-legend">
          <h3>AQI Heatmap Scale</h3>
          <div className="aqi-gradient-container">
            <div className="aqi-gradient"></div>
            {aqiData && (
              <div
                className="aqi-pointer"
                style={{ left: `${pointerPosition}%` }}
              >
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

        {/* 📌 City AQI Card */}
        {aqiData && (
          <div ref={detailsRef} className="aqi-card">
            <h2>{aqiData.city.name}</h2>
            <p className="aqi-value-line">
              <strong>AQI:</strong> {aqiData.aqi}
              <span
                className={`aqi-indicator level-${getAQILevel(aqiData.aqi)}`}
              ></span>
              <span className="aqi-message">
                ({getAQIMessage(aqiData.aqi)})
              </span>
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

        {/* 📈 AQI Forecast Chart */}
        {aqiData && aqiData.forecast?.daily?.pm25 && (
          <>
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

            {/* 📊 AQI Summary & Projection */}
            <div className="aqi-summary">
              {(() => {
                const forecast = aqiData.forecast.daily.pm25;
                const first = forecast[0]?.avg || 0;
                const last = forecast[forecast.length - 1]?.avg || 0;
                const change = (((last - first) / first) * 100).toFixed(1);

                const slope = (last - first) / forecast.length;
                const projected = (last + slope * 5).toFixed(1);

                return (
                  <>
                    <h2>Air Quality Trends</h2>
                    <p>
                      At the beginning of the forecast, AQI was{" "}
                      <strong>{first}</strong>. Now it is{" "}
                      <strong>{last}</strong>, showing a{" "}
                      <strong
                        style={{ color: change > 0 ? "red" : "lightgreen" }}
                      >
                        {change > 0
                          ? `${change}% increase`
                          : `${Math.abs(change)}% decrease`}
                      </strong>
                      .
                    </p>
                    <p>
                      If the current trend continues, AQI is projected to be
                      around <strong>{projected}</strong> in the next 5 years.
                    </p>
                  </>
                );
              })()}
            </div>
          </>
        )}

        {/* 🛡️ Precautionary Tips Section */}
        {aqiData && (
          <div className="precautions">
            <h2>Precautionary Measures</h2>
            <ul>{getDetailedPrecautions(aqiData.aqi)}</ul>
          </div>
        )}
      </div>
    </>
  );
}

// Helpers remain unchanged
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
function getDetailedPrecautions(aqi) {
  if (aqi <= 50)
    return (
      <>
        <li>Enjoy outdoor activities freely ✅</li>
        <li>No health risks expected.</li>
        <li>Maintain a healthy lifestyle with outdoor exercises.</li>
        <li>Open windows to ventilate your home.</li>
        <li>Encourage kids to play outdoors.</li>
      </>
    );
  if (aqi <= 100)
    return (
      <>
        <li>Safe for most people 🙂</li>
        <li>Sensitive individuals should monitor symptoms.</li>
        <li>Keep windows closed during peak traffic hours.</li>
        <li>Limit outdoor exercises near roads.</li>
        <li>Consider using air filters indoors.</li>
      </>
    );
  if (aqi <= 150)
    return (
      <>
        <li>⚠️ Sensitive groups should reduce outdoor exertion.</li>
        <li>Wear an anti-pollution mask when outside.</li>
        <li>Use air purifiers indoors.</li>
        <li>Limit outdoor exposure for children and elderly.</li>
        <li>Avoid outdoor exercise during evening traffic.</li>
      </>
    );
  if (aqi <= 200)
    return (
      <>
        <li>❌ Avoid prolonged outdoor activities.</li>
        <li>All individuals may experience discomfort.</li>
        <li>Keep children and elderly indoors.</li>
        <li>Close windows and doors tightly.</li>
        <li>Use N95/N99 masks outdoors.</li>
      </>
    );
  if (aqi <= 300)
    return (
      <>
        <li>🚨 Serious health effects possible.</li>
        <li>Everyone should avoid outdoor activities.</li>
        <li>Run air purifiers indoors 24/7.</li>
        <li>Limit use of vehicles to reduce pollution.</li>
        <li>Follow local government health advisories.</li>
      </>
    );
  return (
    <>
      <li>☠️ Emergency situation! Hazardous air quality.</li>
      <li>Stay indoors with air purifiers running.</li>
      <li>Avoid all physical activity outside.</li>
      <li>Follow government advisories strictly.</li>
      <li>Seek medical attention if feeling unwell.</li>
    </>
  );
}

export default CheckCity;
