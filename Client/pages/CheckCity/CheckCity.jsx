// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts";
// // import L from "leaflet";
// // import "leaflet/dist/leaflet.css";
// // import "./CheckCity.css";

// // function CheckCity() {
// //   const [country, setCountry] = useState("");
// //   const [cities, setCities] = useState([]);
// //   const [cityUid, setCityUid] = useState("");
// //   const [aqiData, setAqiData] = useState(null);

// //   const mapRef = useRef(null);

// //   // ✅ Initialize WAQI Global Heatmap Layer
// //   useEffect(() => {
// //     if (!mapRef.current) {
// //       mapRef.current = L.map("map").setView([20, 0], 2);

// //       // OpenStreetMap base tiles
// //       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
// //         attribution: "© OpenStreetMap contributors",
// //       }).addTo(mapRef.current);

// //       // WAQI AQI Tiles Layer
// //       L.tileLayer(
// //         "https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=d590c44ddff6390902a11009e9f9abb08dc18a5c",
// //         {
// //           attribution:
// //             'Air Quality data © <a href="https://waqi.info/">waqi.info</a>',
// //         }
// //       ).addTo(mapRef.current);
// //     }
// //   }, []);

// //   // Fetch list of stations for a country
// //   // Fetch list of stations for a country
// //   // Fetch list of stations for a country
// //   const fetchCities = async (countryName) => {
// //     try {
// //       const response = await fetch(`/api/countries/${countryName}`);
// //       const data = await response.json();

// //       const uniqueCities = {};
// //       (data.cities || []).forEach((c) => {
// //         // Split by comma → [City, State, ...]
// //         const parts = c.name.split(",").map((p) => p.trim());
// //         const cityState =
// //           parts.length >= 2 ? `${parts[0]}, ${parts[1]}` : parts[0];

// //         // Keep only one entry per "City, State"
// //         if (!uniqueCities[cityState]) {
// //           uniqueCities[cityState] = { uid: c.uid, name: cityState };
// //         }
// //       });

// //       setCities(Object.values(uniqueCities));
// //     } catch (error) {
// //       console.error("Error fetching cities:", error);
// //     }
// //   };

// //   // Fetch AQI details for selected city UID
// //   const fetchCityData = async (uid) => {
// //     try {
// //       const response = await fetch(`/api/station/${uid}`);
// //       const data = await response.json();
// //       setAqiData(data);
// //     } catch (error) {
// //       console.error("Error fetching AQI data:", error);
// //     }
// //   };

// //   const handleCountryChange = (e) => {
// //     const selectedCountry = e.target.value;
// //     setCountry(selectedCountry);
// //     setCities([]);
// //     setCityUid("");
// //     setAqiData(null);

// //     if (selectedCountry) {
// //       fetchCities(selectedCountry);
// //     }
// //   };

// //   const handleCityChange = (e) => {
// //     const uid = e.target.value;
// //     setCityUid(uid);
// //     if (uid) {
// //       fetchCityData(uid);
// //     }
// //   };

// //   return (
// //     <div className="app">
// //       <h1>🌍 Global Air Quality Monitor</h1>

// //       {/* ✅ AQI World Heatmap */}
// //       <div id="map" className="aqi-map"></div>

// //       {/* ✅ AQI Legend Heatmap */}
// //       <div className="aqi-legend">
// //         <h3>AQI Heatmap Scale</h3>
// //         <div className="aqi-gradient"></div>
// //         <div className="aqi-labels">
// //           <span>0–50 Good</span>
// //           <span>51–100 Moderate</span>
// //           <span>101–150 Sensitive</span>
// //           <span>151–200 Unhealthy</span>
// //           <span>201–300 Very Unhealthy</span>
// //           <span>301+ Hazardous</span>
// //         </div>
// //       </div>

// //       {/* Dropdowns */}
// //       <div className="dropdowns">
// //         <select value={country} onChange={handleCountryChange}>
// //           <option value="">Select Country</option>
// //           <option value="India">India</option>
// //           <option value="USA">USA</option>
// //           <option value="China">China</option>
// //         </select>

// //         <select
// //           value={cityUid}
// //           onChange={handleCityChange}
// //           disabled={!cities.length}
// //         >
// //           <option value="">Select City</option>
// //           {cities.map((c) => (
// //             <option key={c.uid} value={c.uid}>
// //               {c.name}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* City AQI Card */}
// //       {aqiData && (
// //         <div className={`aqi-card level-${getAQILevel(aqiData.aqi)}`}>
// //           <h2>{aqiData.city.name}</h2>
// //           <p>
// //             <strong>AQI:</strong> {aqiData.aqi} ({getAQIMessage(aqiData.aqi)})
// //           </p>
// //           <p>
// //             <strong>Dominant Pollutant:</strong> {aqiData.dominentpol}
// //           </p>
// //           <p>
// //             <strong>Last Updated:</strong> {aqiData.time.s}
// //           </p>
// //           <p className="advice">{getAQIAdvice(aqiData.aqi)}</p>
// //         </div>
// //       )}

// //       {/* AQI Chart */}
// //       {aqiData && aqiData.forecast?.daily?.pm25 && (
// //         <div className="chart-container">
// //           <ResponsiveContainer width="100%" height={400}>
// //             <LineChart data={aqiData.forecast.daily.pm25}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="day" />
// //               <YAxis />
// //               <Tooltip />
// //               <Legend />
// //               <Line type="monotone" dataKey="min" stroke="#8884d8" />
// //               <Line type="monotone" dataKey="avg" stroke="#82ca9d" />
// //               <Line type="monotone" dataKey="max" stroke="#ff4d4f" />
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // AQI helpers
// // function getAQILevel(aqi) {
// //   if (aqi <= 50) return "good";
// //   if (aqi <= 100) return "moderate";
// //   if (aqi <= 150) return "unhealthy-sensitive";
// //   if (aqi <= 200) return "unhealthy";
// //   if (aqi <= 300) return "very-unhealthy";
// //   return "hazardous";
// // }

// // function getAQIMessage(aqi) {
// //   if (aqi <= 50) return "Good";
// //   if (aqi <= 100) return "Moderate";
// //   if (aqi <= 150) return "Unhealthy for Sensitive Groups";
// //   if (aqi <= 200) return "Unhealthy";
// //   if (aqi <= 300) return "Very Unhealthy";
// //   return "Hazardous";
// // }

// // function getAQIAdvice(aqi) {
// //   if (aqi <= 50) return "✅ Air quality is good. Safe to go outside.";
// //   if (aqi <= 100) return "🙂 Acceptable air quality, but be mindful.";
// //   if (aqi <= 150)
// //     return "⚠️ Sensitive groups should reduce prolonged outdoor exertion.";
// //   if (aqi <= 200) return "❌ Everyone should limit outdoor activity.";
// //   if (aqi <= 300) return "🚨 Health alert: Avoid outdoor activities.";
// //   return "☠️ Hazardous air quality. Stay indoors.";
// // }

// // export default CheckCity;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "./CheckCity.css";

// function CheckCity() {
//   const [country, setCountry] = useState("");
//   const [cities, setCities] = useState([]);
//   const [cityUid, setCityUid] = useState("");
//   const [aqiData, setAqiData] = useState(null);

//   const mapRef = useRef(null);

//   // Initialize Leaflet Map
//   useEffect(() => {
//     if (!mapRef.current) {
//       mapRef.current = L.map("map").setView([20, 0], 2);

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(mapRef.current);

//       L.tileLayer(
//         "https://tiles.aqicn.org/tiles/usepa-aqi/{z}/{x}/{y}.png?token=d590c44ddff6390902a11009e9f9abb08dc18a5c",
//         {
//           attribution:
//             'Air Quality data © <a href="https://waqi.info/">waqi.info</a>',
//         }
//       ).addTo(mapRef.current);
//     }
//   }, []);

//   const fetchCities = async (countryName) => {
//     try {
//       const response = await fetch(`/api/countries/${countryName}`);
//       const data = await response.json();
//       const uniqueCities = {};
//       (data.cities || []).forEach((c) => {
//         const parts = c.name.split(",").map((p) => p.trim());
//         const cityState =
//           parts.length >= 2 ? `${parts[0]}, ${parts[1]}` : parts[0];
//         if (!uniqueCities[cityState]) {
//           uniqueCities[cityState] = { uid: c.uid, name: cityState };
//         }
//       });
//       setCities(Object.values(uniqueCities));
//     } catch (err) {
//       console.error("Error fetching cities:", err);
//     }
//   };

//   const fetchCityData = async (uid) => {
//     try {
//       const response = await fetch(`/api/station/${uid}`);
//       const data = await response.json();
//       setAqiData(data);
//     } catch (err) {
//       console.error("Error fetching AQI:", err);
//     }
//   };

//   return (
//     <div className="dashboard">
//       <h1 className="title">🌍 Global Air Quality Dashboard</h1>

//       {/* Filters */}
//       <div className="filters">
//         <select
//           value={country}
//           onChange={(e) => {
//             setCountry(e.target.value);
//             setCities([]);
//             setCityUid("");
//             setAqiData(null);
//             fetchCities(e.target.value);
//           }}
//         >
//           <option value="">Select Country</option>
//           <option value="India">India</option>
//           <option value="USA">USA</option>
//           <option value="China">China</option>
//         </select>

//         <select
//           value={cityUid}
//           onChange={(e) => {
//             setCityUid(e.target.value);
//             fetchCityData(e.target.value);
//           }}
//           disabled={!cities.length}
//         >
//           <option value="">Select City</option>
//           {cities.map((c) => (
//             <option key={c.uid} value={c.uid}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Grid Layout */}
//       <div className="grid">
//         {/* Map */}
//         <div className="card map-card">
//           <h2>Global AQI Heatmap</h2>
//           <div id="map" className="aqi-map"></div>
//         </div>

//         {/* AQI Info */}
//         {aqiData && (
//           <div className={`card aqi-info ${getAQILevel(aqiData.aqi)}`}>
//             <h2>{aqiData.city.name}</h2>
//             <p>
//               <strong>AQI:</strong> {aqiData.aqi} ({getAQIMessage(aqiData.aqi)})
//             </p>
//             <p>
//               <strong>Pollutant:</strong> {aqiData.dominentpol}
//             </p>
//             <p>
//               <strong>Updated:</strong> {aqiData.time.s}
//             </p>
//             <p className="advice">{getAQIAdvice(aqiData.aqi)}</p>
//           </div>
//         )}

//         {/* AQI Chart */}
//         {aqiData && aqiData.forecast?.daily?.pm25 && (
//           <div className="card chart-card">
//             <h2>PM2.5 Forecast</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={aqiData.forecast.daily.pm25}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="min"
//                   stroke="#82ca9d"
//                   strokeWidth={2}
//                   dot={false}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="avg"
//                   stroke="#8884d8"
//                   strokeWidth={2}
//                   dot={false}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="max"
//                   stroke="#ff4d4f"
//                   strokeWidth={2}
//                   dot={false}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Helpers
// function getAQILevel(aqi) {
//   if (aqi <= 50) return "good";
//   if (aqi <= 100) return "moderate";
//   if (aqi <= 150) return "sensitive";
//   if (aqi <= 200) return "unhealthy";
//   if (aqi <= 300) return "very-unhealthy";
//   return "hazardous";
// }
// function getAQIMessage(aqi) {
//   if (aqi <= 50) return "Good";
//   if (aqi <= 100) return "Moderate";
//   if (aqi <= 150) return "Unhealthy for Sensitive Groups";
//   if (aqi <= 200) return "Unhealthy";
//   if (aqi <= 300) return "Very Unhealthy";
//   return "Hazardous";
// }
// function getAQIAdvice(aqi) {
//   if (aqi <= 50) return "✅ Safe to go outside.";
//   if (aqi <= 100) return "🙂 Acceptable air quality.";
//   if (aqi <= 150) return "⚠️ Sensitive groups reduce outdoor exertion.";
//   if (aqi <= 200) return "❌ Limit outdoor activity.";
//   if (aqi <= 300) return "🚨 Health alert: Avoid outdoor activities.";
//   return "☠️ Stay indoors.";
// }

// export default CheckCity;

import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

  // Fetch list of stations for a country
  // Fetch list of stations for a country
  // Fetch list of stations for a country
  const fetchCities = async (countryName) => {
    try {
      const response = await fetch(`/api/countries/${countryCode}`);
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

  return (
    <div className="app">
      <h1>🌍 Global Air Quality Monitor</h1>

      {/* ✅ AQI World Heatmap */}
      <div id="map" className="aqi-map"></div>

      {/* ✅ AQI Legend Heatmap */}
      <div className="aqi-legend">
        <h3>AQI Heatmap Scale</h3>
        <div className="aqi-gradient"></div>
        <div className="aqi-labels">
          <span>0–50 Good</span>
          <span>51–100 Moderate</span>
          <span>101–150 Sensitive</span>
          <span>151–200 Unhealthy</span>
          <span>201–300 Very Unhealthy</span>
          <span>301+ Hazardous</span>
        </div>
      </div>

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

      {/* City AQI Card */}
      {aqiData && (
        <div className={`aqi-card level-${getAQILevel(aqiData.aqi)}`}>
          <h2>{aqiData.city.name}</h2>
          <p>
            <strong>AQI:</strong> {aqiData.aqi} ({getAQIMessage(aqiData.aqi)})
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
