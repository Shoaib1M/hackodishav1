// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Use your WAQI API token
// const WAQI_TOKEN =
//   process.env.WAQI_TOKEN || "d590c44ddff6390902a11009e9f9abb08dc18a5c";

// // --- Get AQI for a city ---
// app.get("/api/city/:city", async (req, res) => {
//   const { city } = req.params;

//   try {
//     // 1. Current AQI
//     const response = await axios.get(
//       `https://api.waqi.info/feed/${encodeURIComponent(
//         city
//       )}/?token=${WAQI_TOKEN}`
//     );

//     if (!response.data || response.data.status !== "ok") {
//       return res
//         .status(404)
//         .json({ error: "City not found or no data available" });
//     }

//     const data = response.data.data;

//     // 2. Historical Data (past 7 days, hourly avg)
//     let history = [];
//     if (data.forecast && data.forecast.daily && data.forecast.daily.pm25) {
//       history = data.forecast.daily.pm25.map((h) => ({
//         date: h.day,
//         min: h.min,
//         max: h.max,
//         avg: h.avg,
//       }));
//     }

//     // 3. Build response object
//     const cityData = {
//       city: data.city.name,
//       aqi: data.aqi,
//       dominentpol: data.dominentpol,
//       time: data.time.s,
//       history, // for charts
//     };

//     res.json(cityData);
//   } catch (error) {
//     console.error("API Error:", error.message);
//     res.status(500).json({ error: "Failed to fetch AQI" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());

// Get the directory name of the current module to build absolute paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const API_KEY =
  process.env.WAQI_TOKEN || "d590c44ddff6390902a11009e9f9abb08dc18a5c";

// ✅ Simple root route to confirm the server is running
app.get("/", (req, res) => {
  res.send("<h1>API Server is running</h1><p>Try accessing /api/noise</p>");
});

// Bounding boxes for countries (southLat, westLng, northLat, eastLng)
const countryBounds = {
  India: [6.7, 68.1, 35.5, 97.4],
  USA: [24.5, -125, 49.5, -66],
  China: [18, 73, 53, 135],
};

// ✅ Get list of stations (cities) for a given country
app.get("/api/countries/:country", async (req, res) => {
  try {
    const country = req.params.country;
    const bounds = countryBounds[country];

    if (!bounds) {
      return res.status(400).json({ error: "Country not supported yet" });
    }

    const url = `https://api.waqi.info/map/bounds/?latlng=${bounds.join(
      ","
    )}&token=${API_KEY}`;

    console.log("🌍 Fetching WAQI URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.status !== "ok") {
      console.error("❌ Bad WAQI response:", data);
      return res
        .status(500)
        .json({ error: "Failed to fetch stations", detail: data });
    }

    const cities = data.data.map((s) => ({
      uid: s.uid,
      name: s.station.name,
      lat: s.lat,
      lon: s.lon,
      aqi: s.aqi,
    }));

    res.json({ country, cities });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get AQI details for a station UID
app.get("/api/station/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const url = `https://api.waqi.info/feed/@${uid}/?token=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.status !== "ok") {
      return res
        .status(500)
        .json({ error: "Failed to fetch AQI", detail: data });
    }

    res.json(data.data);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Noise Pollution Data (from CSV)
app.get("/api/noise", (req, res) => {
  const results = [];
  const csvPath = path.join(__dirname, "noise_pollution_india.csv");

  const stream = fs.createReadStream(csvPath);

  // CRITICAL: Handle errors, like "file not found"
  stream.on("error", (error) => {
    console.error("Error reading CSV file:", error);
    res.status(500).json({ error: "Could not read noise pollution data." });
  });

  stream
    .pipe(
      csv({
        separator: "\t",
        mapHeaders: ({ header }) => header.trim(),
      })
    )
    .on("data", (row) => {
      results.push({
        Station: row.Station.trim(),
        Year: +row.Year,
        Day: +row["Day (Db)"],
        Night: +row["Night (Db)"],
        DayLimit: +row["DayLimit (Db)"],
        NightLimit: +row["NightLimit (Db)"],
      });
    })
    .on("end", () => {
      res.json(results);
    });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
